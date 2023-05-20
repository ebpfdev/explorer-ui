import { useSearchParams } from "react-router-dom";

export function useSearchParamsState<T>(
  searchParamName: string,
  defaultValue: T,
  convert: (value: string) => T
): readonly [
  searchParamsState: T,
  setSearchParamsState: (newState: string) => void
] {
  const [searchParams, setSearchParams] = useSearchParams();

  const acquiredSearchParam = searchParams.get(searchParamName);
  const searchParamsState = acquiredSearchParam ? convert(acquiredSearchParam) : defaultValue;

  const setSearchParamsState = (newState: string) => {
    const next = Object.assign(
      {},
      // @ts-ignore
      [...searchParams.entries()].reduce(
        (o, [key, value]) => ({ ...o, [key]: value }),
        {}
      ),
      { [searchParamName]: newState }
    );
    setSearchParams(next);
  };
  return [searchParamsState, setSearchParamsState];
}