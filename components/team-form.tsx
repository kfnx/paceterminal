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



interface TeamFormProps {
  team?: Team;
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
  team,
  tokenAddress,
  isOpen,
  onClose,
  onSuccess,
}: TeamFormProps) {
  const [formData, setFormData] = React.useState<TeamFormData>({
    id: '',
    name: '',
    role: '',
    description: '',
    image: '',
    x_account: '',
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      if (team) {
        setFormData({
          id: team.id,
          name: team.name || '',
          role: team.role || '',
          description: team.description || '',
          image: team.image || '',
          x_account: team.x_account || '',
        });
      } else {
        setFormData({
          id: uuidv4(),
          name: '',
          role: '',
          description: '',
          image: '',
          x_account: '',
        });
      }
    }
  }, [team, isOpen]);

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  const handleChange = (field: keyof TeamFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.name.trim()) {
        toast.error('Team member name is required');
        return;
      }

      const teamData = {
        ...(team && { id: team.id }),
        address: tokenAddress,
        name: formData.name.trim(),
        role: formData.role.trim(),
        description: formData.description.trim() || null,
        image: formData.image.trim() || null,
        x_account: formData.x_account.trim() || null,
      };

      const { error } = await supabase
        .from('teams')
        .upsert([teamData], { onConflict: 'id' });

      if (error) throw error;

      toast.success(team ? 'Team member updated successfully' : 'Team member created successfully');
      onSuccess();
    } catch (error) {
      console.error('Error saving team member:', error);
      toast.error('Failed to save team member. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal.Root open={isOpen} onOpenChange={handleClose}>
      <Modal.Content className='max-w-2xl'>
        <Modal.Header>
          <Modal.Title>{team ? 'Edit Team Member' : 'Add Team Member'}</Modal.Title>
          <Modal.Description>
            {team ? 'Update the team member details.' : 'Add a new team member for this token.'}
          </Modal.Description>
        </Modal.Header>

        <form onSubmit={handleSubmit}>
          <Modal.Body className='space-y-6'>
            <div className='space-y-4'>
              <div className='flex flex-col gap-1'>
                <Label.Root>Profile Image URL</Label.Root>
                <Input.Root>
                  <Input.Wrapper>
                    <Input.Input
                      value={formData.image}
                      onChange={(e) =>
                        handleChange('image', e.target.value)
                      }
                      placeholder='Enter image URL (e.g., https://example.com/image.jpg)'
                      disabled={isSubmitting}
                    />
                  </Input.Wrapper>
                </Input.Root>
              </div>

              <div className='flex flex-col gap-2'>
                <div className='flex flex-col gap-1'>
                  <Label.Root>Name <Label.Asterisk /></Label.Root>
                  <Input.Root>
                    <Input.Wrapper>
                      <Input.Input
                        value={formData.name}
                        onChange={(e) =>
                          handleChange('name', e.target.value)
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
                        value={formData.role}
                        onChange={(e) =>
                          handleChange('role', e.target.value)
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
                        value={formData.x_account}
                        onChange={(e) =>
                          handleChange('x_account', e.target.value)
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
                  value={formData.description}
                  onChange={(e) =>
                    handleChange('description', e.target.value)
                  }
                  placeholder='Brief description of the team member'
                  rows={2}
                  disabled={isSubmitting}
                ></Textarea.Root>
              </div>
            </div>
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
              {isSubmitting ? 'Saving...' : (team ? 'Save Changes' : 'Add Team Member')}
            </Button.Root>
          </Modal.Footer>
        </form>
      </Modal.Content>
    </Modal.Root>
  );
}
