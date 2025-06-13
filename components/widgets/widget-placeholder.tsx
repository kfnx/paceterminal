'use client';

import * as Divider from '@/components/ui/divider';
import * as WidgetBox from '@/components/widget-box';

export function WidgetPlaceholder({
  title,
  icon,
  children,
  ...rest
}: React.ComponentPropsWithoutRef<typeof WidgetBox.Root> & {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <WidgetBox.Root {...rest} id={title.toLowerCase()}>
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={icon} />
        {title}
      </WidgetBox.Header>

      <div className='flex flex-col gap-4'>
        <Divider.Root />

        {children}
      </div>
    </WidgetBox.Root>
  );
}
