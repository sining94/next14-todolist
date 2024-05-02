//swr 사용을 위한 패치함수
export const fetcher = (url: string) => fetch(url).then((res) => res.json());
