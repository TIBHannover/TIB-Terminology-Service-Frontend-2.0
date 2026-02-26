import {RouteComponentProps} from "react-router-dom";
import collectionsInfoJson from "../../assets/collectionsText.json";
import {CollectionJsonData} from "./types";
import {useState, useEffect} from "react";
import NotFound from "../../errors/notFound";


type CmpProps = RouteComponentProps<{ collectionId: string }>;
type CollectionsData = Record<string, CollectionJsonData>

const CollectionPage = (props: CmpProps) => {
    const collectionIdFromUrl = props.match.params.collectionId;
    const CollectionsMetadata = collectionsInfoJson as CollectionsData;

    const [collection, setCollection] = useState<CollectionJsonData | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let processedCollectionId = collectionIdFromUrl.split("_").join(" ");
        let collectionIds = Object.keys(CollectionsMetadata);
        for (let colId of collectionIds) {
            if (colId.toLowerCase() === processedCollectionId.toLowerCase()) {
                setCollection(CollectionsMetadata[colId]);
                break;
            }
        }
        setLoading(false);
    }, []);


    if (!loading && !collection) {
        return (
            <div className="row">
                <NotFound/>
            </div>
        );
    }

    return (
        <div className="row bg-white p-4">
            <div className="col-12">
                {/*<p className="fs-3 fw-bold text-center">{collection?.name}</p>*/}
            </div>
            <div className="row">
                <div className="col-4">
                    <img className="img-fluid" src={collection?.logo} alt={collection?.name}/>
                </div>
                <div className="col-8">
                    <div dangerouslySetInnerHTML={{__html: collection?.text ?? ""}}></div>
                </div>
            </div>
        </div>
    );
}

export default CollectionPage;