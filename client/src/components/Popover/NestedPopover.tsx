import React, { useEffect, useState } from "react";
import * as reactDomInteractions from "@floating-ui/react-dom-interactions";

interface Props {
  render: (data: {
    close: () => void;
    labelId: string;
    descriptionId: string;
  }) => React.ReactNode;
  placement?: reactDomInteractions.Placement;
}

const Popover: React.FC<Props> = ({ children, render }) => {
  const [open, setOpen] = useState(false);

  const nodeId = reactDomInteractions.useFloatingNodeId();

  const { x, y, reference, floating, strategy, refs, update, context } =
    reactDomInteractions.useFloating({
      open,
      onOpenChange: setOpen,
      middleware: [
        reactDomInteractions.offset(4),
        reactDomInteractions.flip(),
        reactDomInteractions.shift(),
      ],
      placement: "left-end",
      nodeId,
    });

  const id = reactDomInteractions.useId();
  const labelId = `${id}-label`;
  const descriptionId = `${id}-description`;

  const { getReferenceProps, getFloatingProps } =
    reactDomInteractions.useInteractions([
      reactDomInteractions.useClick(context),
      reactDomInteractions.useRole(context),
      reactDomInteractions.useDismiss(context),
      reactDomInteractions.useFocusTrap(context),
    ]);

  useEffect(() => {
    if (refs.reference.current && refs.floating.current && open) {
      return reactDomInteractions.autoUpdate(
        refs.reference.current,
        refs.floating.current,
        update
      );
    }
  }, [open, update, refs.reference, refs.floating]);

  return (
    <reactDomInteractions.FloatingNode id={nodeId}>
      {React.isValidElement(children) &&
        React.cloneElement(children, getReferenceProps({ ref: reference }))}
      <reactDomInteractions.FloatingPortal>
        {open && (
          <div
            {...getFloatingProps({
              className: "Popover",
              ref: floating,
              style: {
                position: strategy,
                top: y ?? "",
                left: x ?? "",
              },
              "aria-labelledby": labelId,
              "aria-describedby": descriptionId,
            })}
          >
            {render({
              labelId,
              descriptionId,
              close: () => {
                setOpen(false);
                (refs.reference.current as HTMLElement).focus();
              },
            })}
          </div>
        )}
      </reactDomInteractions.FloatingPortal>
    </reactDomInteractions.FloatingNode>
  );
};

export const NestedPopover: React.FC<Props> = (props) => {
  const parentId = reactDomInteractions.useFloatingParentNodeId();

  if (parentId == null) {
    return (
      <reactDomInteractions.FloatingTree>
        <Popover {...props} />
      </reactDomInteractions.FloatingTree>
    );
  }

  return <Popover {...props} />;
};
