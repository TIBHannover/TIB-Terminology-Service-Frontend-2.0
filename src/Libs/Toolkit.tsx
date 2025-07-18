import {Helmet, HelmetProvider} from 'react-helmet-async';
import {inspect} from 'util';
import CommonUrlFactory from '../UrlFactory/CommonUrlFactory';


type GenericObject = {
    [key: string]: any;
}


const urlFacory = new CommonUrlFactory();


class Toolkit {

    static createHelmet(helmetString: string): JSX.Element[] {
        return [
            <HelmetProvider>
                <div>
                    <Helmet>
                        <title>{helmetString}</title>
                    </Helmet>
                </div>
            </HelmetProvider>
        ];
    }


    static sortListOfObjectsByKey(objectList: Array<GenericObject>, key: string, isReverse: boolean = false, parentKey: string = "") {
        let reverseSortSign = !isReverse ? 1 : -1;
        if (parentKey) {
            return objectList.sort(function (a: GenericObject, b: GenericObject) {
                let x: number | string = typeof a[key] === "number" ? a[parentKey][key] : a[parentKey][key]?.toLowerCase();
                let y: number | string = typeof b[key] === "number" ? b[parentKey][key] : b[parentKey][key]?.toLowerCase();
                return (x < y ? reverseSortSign : (-1 * reverseSortSign))
            });
        }
        return objectList.sort(function (a: GenericObject, b: GenericObject) {
            let x: number | string = typeof a[key] === "number" ? a[key] : a[key]?.toLowerCase();
            let y: number | string = typeof b[key] === "number" ? b[key] : b[key]?.toLowerCase();
            return (x < y ? reverseSortSign : (-1 * reverseSortSign))
        });
    }


    static transformLinksInStringToAnchor(text: string) {
        try {
            if (typeof (text) !== "string") {
                return text;
            }
            let urlRegex = /https?:\/\/(?:www\.)?[^\s/$.?#].[^\s]*/g;
            text = text.replace('<', ' ');
            text = text.replace('>', ' ');
            let result = text.replace(urlRegex, (url) => {
                if (url.at(-1) === ",") {
                    url = url.slice(0, -1);
                }
                return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a><br/>`;
            });
            return result;
        } catch (e) {
            return text;
        }
    }


    static getObjectInListIfExist(list: Array<GenericObject>, searchKey: string, searchValue: any) {
        for (let item of list) {
            if (item[searchKey] === searchValue) {
                return item;
            }
        }
        return false;
    }


    static getVarInLocalSrorageIfExist(varName: string, defaultValue: string) {
        return localStorage.getItem(varName) ?? defaultValue;
    }


    static getObsoleteFlagValue() {
        let currentUrlParams = new URL(window.location.href).searchParams;
        if (!currentUrlParams.get('obsoletes')) {
            let obsoleteValue: any = Toolkit.getVarInLocalSrorageIfExist("obsoletes", "false");
            obsoleteValue = obsoleteValue === "true" ? true : false;
            return Boolean(obsoleteValue);
        }
        let obsoleteValue = currentUrlParams.get('obsoletes') === "true" ? true : false;
        return obsoleteValue;
    }

    static setObsoleteInStorageAndUrl(obsoletesValue: boolean | string) {
        // @ts-ignore
        localStorage.setItem("obsoletes", obsoletesValue);
        // @ts-ignore
        document.getElementById("obsoletes-checkbox").checked = obsoletesValue;
        urlFacory.setObsoletes({value: obsoletesValue});
        return true;
    }


    static urlNotEncoded(url: string) {
        try {
            const decodedUrl = decodeURIComponent(url);
            return decodedUrl === url;
        } catch (error) {
            return false;
        }
    }


    static formatDateTime(datetime: string | undefined) {
        // if the time is 00:00:00, then remove it
        if (datetime && typeof (datetime) !== "undefined" && datetime.includes("00:00:00")) {
            let date = datetime.split("00:00:00")[0];
            return date;
        }
        return datetime;
    }


    static getRandomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min
    };


    static listOfSiteLangs(): { label: string, value: string }[] {
        let langs = ["ar", "bg", "cs", "da", "de", "el", "en", "es", "et", "fi", "fr", "hr", "hu", "it", "ja", "la", "lt", "lv", "nl", "no", "pl", "pt", "ro", "sk", "sl", "sv", "zh", "zh-tw"];
        let result = [];
        for (let l of langs) {
            result.push({"label": l, "value": l});
        }
        return result;
    }


    static isString(input: any): boolean {
        if (input instanceof String || typeof input === "string") {
            return true;
        }
        return false;
    }

    static selectSiteNavbarOption(navbarText: string) {
        let currentSelected = document.getElementsByClassName("nav-clicked");
        if (currentSelected.length > 0) {
            currentSelected[0].classList.remove("nav-clicked");
        }
        let navOptions = document.getElementsByClassName("nav-link");
        for (let nav of navOptions) {
            if (nav.innerHTML === navbarText) {
                nav.classList.add("nav-clicked");
            }
        }
    }


}

export default Toolkit;