import {RouteComponentProps} from "react-router-dom";


type CmpProps = RouteComponentProps<{ collectionId: string }>;

const CollectionPage = (props: CmpProps) => {
    const collectionId = props.match.params.collectionId;

    return (
        <>
            <h3>Collection {collectionId}</h3>
        </>
    );
}

export default CollectionPage;