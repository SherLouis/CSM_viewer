import React, { useState } from 'react';
import {Box, Col, Collapse, Group, Paper} from '@mantine/core';
import { IconArrowDown, IconArrowUp } from '@tabler/icons-react';
export const CollapsibleSection = (props: CollapsibleSectionProps) => {
  const [expanded, setExpanded] = useState(props.expanded)
  return (
    <Paper>
      <Group position='apart' onClick={() => setExpanded(!expanded)}>
        <Paper>
          {props.title}
        </Paper>
        {expanded ? <IconArrowUp/> : <IconArrowDown/>}
      </Group>
      <Collapse in={expanded} onTransitionEnd={props.onToggle}>
        {props.content}
      </Collapse>
    </Paper>
  );
}

export type CollapsibleSectionProps = {
  expanded: boolean
  title: React.ReactNode
  content: React.ReactNode
  onToggle?: ()=>void
}

