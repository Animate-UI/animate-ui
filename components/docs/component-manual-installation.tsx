'use client';

import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock';
import { InstallTabs } from '@/registry/components/install-tabs';
import { Step, Steps } from 'fumadocs-ui/components/steps';
import { CollapsibleContent } from 'fumadocs-ui/components/ui/collapsible';
import { Collapsible } from 'fumadocs-ui/components/ui/collapsible';
import { CollapsibleTrigger } from 'fumadocs-ui/components/ui/collapsible';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { useRef, useState } from 'react';

const getDepsCommands = (dependencies?: string[]) => {
  if (!dependencies) return undefined;
  return {
    npm: `npm install ${dependencies?.join(' ')}`,
    pnpm: `pnpm add ${dependencies?.join(' ')}`,
    yarn: `yarn add ${dependencies?.join(' ')}`,
    bun: `bun add ${dependencies?.join(' ')}`,
  };
};

const getRegistryDepsCommands = (dependencies?: string[]) => {
  if (!dependencies) return undefined;
  const quotedDependencies = dependencies.map((dep) => `"${dep}"`).join(' ');
  return {
    npm: `npx shadcn@latest add ${quotedDependencies}`,
    pnpm: `pnpm dlx shadcn@latest add ${quotedDependencies}`,
    yarn: `npx shadcn@latest add ${quotedDependencies}`,
    bun: `bun x --bun shadcn@latest add ${quotedDependencies}`,
  };
};

export const ComponentManualInstallation = ({
  dependencies,
  devDependencies,
  registryDependencies,
  code,
}: {
  dependencies?: string[];
  devDependencies?: string[];
  registryDependencies?: string[];
  code: string;
}) => {
  const depsCommands = getDepsCommands(dependencies);
  const devDepsCommands = getDepsCommands(devDependencies);
  const registryDepsCommands = getRegistryDepsCommands(registryDependencies);

  const [isOpened, setIsOpened] = useState(false);
  const collapsibleRef = useRef<HTMLDivElement>(null);

  return (
    <Steps>
      {dependencies && depsCommands && (
        <Step>
          <h4 className="pt-1 pb-4">Install the following dependencies:</h4>
          <InstallTabs commands={depsCommands} />
        </Step>
      )}

      {devDependencies && devDepsCommands && (
        <Step>
          <h4 className="pt-1 pb-4">Install the following dev dependencies:</h4>
          <InstallTabs commands={devDepsCommands} />
        </Step>
      )}

      {registryDependencies && registryDepsCommands && (
        <Step>
          <h4 className="pt-1 pb-4">
            Install the following registry dependencies:
          </h4>
          <InstallTabs commands={registryDepsCommands} />
        </Step>
      )}

      <Step>
        <h4 className="pt-1 pb-4">
          Copy and paste the following code into your project:
        </h4>

        <Collapsible open={isOpened} onOpenChange={setIsOpened}>
          <div ref={collapsibleRef} className="relative overflow-hidden">
            <CollapsibleContent
              forceMount
              className={cn('overflow-hidden', !isOpened && 'max-h-32')}
            >
              <div
                className={cn(
                  '[&_pre]:my-0 [&_pre]:max-h-[650px] [&_code]:pb-[60px]',
                  !isOpened
                    ? '[&_pre]:overflow-hidden'
                    : '[&_pre]:overflow-auto]',
                )}
              >
                <DynamicCodeBlock code={code} lang="tsx" />
              </div>
            </CollapsibleContent>
            <div
              className={cn(
                'absolute flex items-center justify-center bg-gradient-to-b from-neutral-300/30 to-white/90 dark:from-neutral-700/30 dark:to-neutral-950/90 p-2',
                isOpened ? 'inset-x-0 bottom-0 h-12' : 'inset-0',
              )}
            >
              <CollapsibleTrigger asChild>
                <Button variant="secondary" className="h-8 text-xs">
                  {isOpened ? 'Collapse' : 'Expand'}
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>
        </Collapsible>
      </Step>

      <Step>
        <h4 className="pt-1 pb-4">
          Update the import paths to match your project setup.
        </h4>
      </Step>
    </Steps>
  );
};
