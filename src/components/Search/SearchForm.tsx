import { TextField } from "@material-ui/core";
import { useState, useEffect, FormEvent } from "react";

export interface Term {
    id: string;
    description: string;
    boolean: false;
  }

export function SearchForm() {
    const [value, setValue] = useState('');
    const [termsSearch, setTermsSearch] = useState('');

    const autoSearch =async (query:string) => {
        const result = await fetch(`https://service.tib.eu/ts4tib/api/suggest?q=${query}`)
        return (await result.json()).results;
      };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
        autoSearch(event.target.value);
      };
    
    const search = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const input = form.querySelector('#searchText') as HTMLInputElement;
        setTermsSearch(input.value);
        input.value = '';
      };

    return (
        <div className="App">
          <h1>NFDI4Chem Terminology Service</h1>
          <TextField
          fullWidth
          onChange={handleChange}
          value={value}
          placeholder="Search NFDI4Chem TS"
        />
          <form className="searchForm" onSubmit={event => search(event)} >
            <input id="searchText" type="text" />
            <button>Search</button>
          </form>
        </div>
      );
}

export default SearchForm;