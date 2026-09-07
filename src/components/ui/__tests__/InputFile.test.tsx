import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
import InputFile from '@/components/ui/InputFile';

function makeFile(name: string, sizeInBytes: number, type: string): File {
  const file = new File(['x'.repeat(sizeInBytes)], name, { type });
  return file;
}

describe('InputFile - validation client (avatar upload)', () => {
  it('rejette un fichier trop volumineux et n appelle pas onFileSelect avec le fichier', () => {
    const onFileSelect = vi.fn();
    const { container, getByText } = render(
      <InputFile
        maxSize={5}
        acceptedFormats={['image/jpeg', 'image/png', 'image/webp']}
        onFileSelect={onFileSelect}
      />
    );

    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const tooLarge = makeFile('avatar.png', 6 * 1024 * 1024, 'image/png');

    fireEvent.change(input, { target: { files: [tooLarge] } });

    expect(onFileSelect).toHaveBeenCalledWith(null);
    expect(getByText(/trop volumineux/i)).toBeTruthy();
  });

  it('rejette un format non accepte et n appelle pas onFileSelect avec le fichier', () => {
    const onFileSelect = vi.fn();
    const { container, getByText } = render(
      <InputFile
        maxSize={5}
        acceptedFormats={['image/jpeg', 'image/png', 'image/webp']}
        onFileSelect={onFileSelect}
      />
    );

    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const wrongType = makeFile('avatar.gif', 1024, 'image/gif');

    fireEvent.change(input, { target: { files: [wrongType] } });

    expect(onFileSelect).toHaveBeenCalledWith(null);
    expect(getByText(/format non support/i)).toBeTruthy();
  });

  it('accepte un fichier valide et transmet le fichier via onFileSelect', () => {
    const onFileSelect = vi.fn();
    const { container } = render(
      <InputFile
        maxSize={5}
        acceptedFormats={['image/jpeg', 'image/png', 'image/webp']}
        onFileSelect={onFileSelect}
      />
    );

    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const valid = makeFile('avatar.png', 1024, 'image/png');

    fireEvent.change(input, { target: { files: [valid] } });

    expect(onFileSelect).toHaveBeenCalledWith(valid);
  });
});
