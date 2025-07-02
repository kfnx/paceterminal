import * as React from 'react';
import {
  RiAddLine,
  RiCloseLine,
  RiDeleteBinLine,
  RiSaveLine,
} from '@remixicon/react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

import { supabase } from '@/lib/supabase';
import type { Team } from '@/hooks/use-teams';
import * as Avatar from '@/components/ui/avatar';
import * as Button from '@/components/ui/button';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as Modal from '@/components/ui/modal';
import * as Textarea from '@/components/ui/textarea';

import { TeamImageUploader } from './ui/team-image-uploader';

interface TeamFormProps {
  teams: Team[];
  tokenAddress: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface TeamFormData {
  id?: string;
  name: string;
  role: string;
  description: string;
  image: string;
  x_account: string;
}

export function TeamForm({
  teams,
  tokenAddress,
  isOpen,
  onClose,
  onSuccess,
}: TeamFormProps) {
  const [formTeams, setFormTeams] = React.useState<TeamFormData[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const EmptyTeamForm = (): TeamFormData => ({
    id: uuidv4(),
    name: '',
    role: '',
    description: '',
    image: '',
    x_account: '',
  });

  React.useEffect(() => {
    if (isOpen) {
      setFormTeams(
        teams.length > 0
          ? teams.map((team) => ({
              id: team.id,
              name: team.name || '',
              role: team.role || '',
              description: team.description || '',
              image: team.image || '',
              x_account: team.x_account || '',
            }))
          : [EmptyTeamForm()],
      );
    }
  }, [teams, isOpen]);

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  const handleAddTeam = () => {
    setFormTeams((prev) => [...prev, EmptyTeamForm()]);
  };

  const handleRemoveTeam = (index: number) => {
    setFormTeams((prev) => prev.filter((_, i) => i !== index));
  };

  const handleTeamChange = (
    index: number,
    field: keyof TeamFormData,
    value: string,
  ) => {
    setFormTeams((prev) =>
      prev.map((team, i) => (i === index ? { ...team, [field]: value } : team)),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const validTeams = formTeams.filter((team) => team.name.trim());
      const existingTeamIds = teams.map((team) => team.id);

      // Create or update team
      const teamsToUpsert = validTeams.map((team) => ({
        ...(team.id && { id: team.id }),
        address: tokenAddress,
        name: team.name.trim(),
        role: team.role.trim(),
        description: team.description.trim() || null,
        image: team.image.trim() || null,
        x_account: team.x_account.trim() || null,
      }));

      const currentTeamIds = validTeams
        .filter((team) => team.id)
        .map((team) => team.id);
      const teamsToDelete = existingTeamIds.filter(
        (id) => !currentTeamIds.includes(id),
      );

      // Deletes removed team
      if (teamsToDelete.length > 0) {
        const { error: deleteError } = await supabase
          .from('teams')
          .delete()
          .in('id', teamsToDelete);

        if (deleteError) throw deleteError;
      }

      // Upsert teams
      if (teamsToUpsert.length > 0) {
        const { data, error: upsertError } = await supabase
          .from('teams')
          .upsert(teamsToUpsert, { onConflict: 'id' });

        console.log(data);

        if (upsertError) throw upsertError;
      }

      toast.success('Teams updated successfully');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error updating teams:', error);
      toast.error('Failed to update teams. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal.Root open={isOpen} onOpenChange={handleClose}>
      <Modal.Content className='max-w-2xl'>
        <Modal.Header>
          <Modal.Title>Edit Team</Modal.Title>
          <Modal.Description>
            Manage the team member for this token.
          </Modal.Description>
        </Modal.Header>

        <form onSubmit={handleSubmit}>
          <Modal.Body className='space-y-6'>
            <div className='max-h-96 space-y-4 overflow-y-auto'>
              {formTeams.map((team, index) => (
                <div key={index} className='space-y-4 rounded-lg'>
                  <div className='flex items-center justify-between'>
                    <h4 className='text-label-sm font-medium text-text-strong-950'>
                      Team Member {index + 1}
                    </h4>
                    {formTeams.length > 1 && (
                      <Button.Root
                        type='button'
                        variant='error'
                        mode='ghost'
                        size='xsmall'
                        onClick={() => handleRemoveTeam(index)}
                        disabled={isSubmitting}
                      >
                        <Button.Icon as={RiDeleteBinLine} />
                      </Button.Root>
                    )}
                  </div>

                  <div className='space-y-2'>
                    <TeamImageUploader
                      tokenAddress={tokenAddress}
                      teamMemberIndex={index}
                      teamMemberName={team.name}
                      currentImageUrl={team.image}
                      onImageUploaded={(imageUrl) =>
                        handleTeamChange(index, 'image', imageUrl)
                      }
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className='flex flex-col gap-2'>
                    <div className='flex flex-col gap-1'>
                      <Label.Root>Name *</Label.Root>
                      <Input.Root>
                        <Input.Wrapper>
                          <Input.Input
                            value={team.name}
                            onChange={(e) =>
                              handleTeamChange(index, 'name', e.target.value)
                            }
                            placeholder='Enter team member name'
                            required
                            disabled={isSubmitting}
                          />
                        </Input.Wrapper>
                      </Input.Root>
                    </div>

                    <div className='flex flex-col gap-1'>
                      <Label.Root>Role</Label.Root>
                      <Input.Root>
                        <Input.Wrapper>
                          <Input.Input
                            value={team.role}
                            onChange={(e) =>
                              handleTeamChange(index, 'role', e.target.value)
                            }
                            placeholder='e.g., CEO, Developer, Designer'
                            disabled={isSubmitting}
                          />
                        </Input.Wrapper>
                      </Input.Root>
                    </div>

                    <div className='flex flex-col gap-1'>
                      <Label.Root>X Account</Label.Root>
                      <Input.Root>
                        <Input.Wrapper>
                          <Input.Input
                            value={team.x_account}
                            onChange={(e) =>
                              handleTeamChange(
                                index,
                                'x_account',
                                e.target.value,
                              )
                            }
                            placeholder='username (without @)'
                            disabled={isSubmitting}
                          />
                        </Input.Wrapper>
                      </Input.Root>
                    </div>
                  </div>

                  <div>
                    <Label.Root>Description</Label.Root>
                    <Textarea.Root
                      value={team.description}
                      onChange={(e) =>
                        handleTeamChange(index, 'description', e.target.value)
                      }
                      placeholder='Brief description of the team member'
                      rows={2}
                      disabled={isSubmitting}
                    ></Textarea.Root>
                  </div>
                </div>
              ))}
            </div>

            <Button.Root
              type='button'
              variant='neutral'
              mode='stroke'
              onClick={handleAddTeam}
              className='w-full'
              disabled={isSubmitting}
            >
              <Button.Icon as={RiAddLine} />
              Add Team Member
            </Button.Root>
          </Modal.Body>

          <Modal.Footer>
            <Button.Root
              type='button'
              variant='neutral'
              mode='stroke'
              onClick={onClose}
              disabled={isSubmitting}
            >
              <Button.Icon as={RiCloseLine} />
              Cancel
            </Button.Root>
            <Button.Root type='submit' disabled={isSubmitting}>
              <Button.Icon as={RiSaveLine} />
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button.Root>
          </Modal.Footer>
        </form>
      </Modal.Content>
    </Modal.Root>
  );
}
