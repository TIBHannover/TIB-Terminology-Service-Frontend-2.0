
export async function olsIsUp(): Promise<boolean> {
  try {
    let getCallSetting = {method: 'GET', headers: {'Accept': 'text/plain;charset=UTF-8 '}};
    let url = process.env.REACT_APP_API_URL + "/accessibility";
    let response = await fetch(url, getCallSetting);
    if(!response.ok) {
        return Promise.reject(new Error(response.statusText));
    }
    let text = await response.text();
    return text === "API is Accessible!"
  } 
  catch (error) {
    return Promise.reject(error);
  }
}