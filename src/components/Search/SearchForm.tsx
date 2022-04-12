import { useState, useEffect } from "react";

export function SearchForm() {
    const [value, setValue] = useState('');

    const autoSearch =async (query:string) => {
        const result = await fetch(`https://service.tib.eu/ts4tib/api/suggest?q=${query}`)
        return (await result.json()).results;
      };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
        autoSearch(event.target.value);
      };

    return (
        <div className="container">
          <input type="text" className="col-md-12 input" style={{marginTop: 10}}
          onChange={handleChange}
          value={value}
          placeholder="Search NFDI4Chem TS"
        />
        </div>
      );
}

export default SearchForm;