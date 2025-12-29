'use client';

import { StytchProvider } from '@stytch/nextjs';
import { createStytchUIClient } from '@stytch/nextjs/ui';

const stytch = createStytchUIClient(
  process.env.NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN!
);


export function StytchProviders({ children }: { children: React.ReactNode }) {

  return (
    <StytchProvider stytch={stytch}>
      {children}
    </StytchProvider>
  );
}