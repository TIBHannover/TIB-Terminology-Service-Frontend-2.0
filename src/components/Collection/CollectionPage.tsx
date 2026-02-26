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
            <h3>Collection {collection?.name}</h3>
        </div>
    );
}

export default CollectionPage;