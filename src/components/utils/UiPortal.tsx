'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export default function UiPortal({
  children,
  rootId = 'ui-root',
}: {
  children: React.ReactNode;
  rootId?: string;
}) {
  const [el, setEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    let root = document.getElementById(rootId);
    if (!root) {
      root = document.createElement('div');
      root.id = rootId;
      root.setAttribute('data-ui', 'true');
      root.style.position = 'relative';
      document.body.appendChild(root);
    }
    setEl(root);
  }, [rootId]);

  if (!el) return null;
  return createPortal(children, el);
}
