export const size: number = 10000;


export const getCallSetting: RequestInit = {
  method: 'GET',
  mode: 'cors',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'caller': process.env.REACT_APP_HEADER_INFO_TIB
  } as HeadersInit
};