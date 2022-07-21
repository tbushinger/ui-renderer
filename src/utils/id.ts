export type CreateId = () => string;

export default function idFactory(): CreateId {
  let counter = 0;

  return (): string => {
    counter++;
    return `${counter}`;
  };
}
