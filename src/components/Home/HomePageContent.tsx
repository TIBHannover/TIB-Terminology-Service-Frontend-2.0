import { useEffect, useRef } from "react";
import collectionsInfoJson from "../../assets/collectionsText.json";
import { Link } from "react-router-dom";
import { CollectionJsonData } from "../Collection/types";

type CollectionsData = Record<string, CollectionJsonData>;

const RenderHomePage = () => {
  const collectionGridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let grid = collectionGridRef.current;
    if (!grid) {
      return;
    }

    let cards = Array.from(
      grid.querySelectorAll<HTMLElement>(".home-reveal-item"),
    );
    let revealThroughIndex = (highestVisibleIndex: number) => {
      let rowDelayIndexes = new Map<number, number>();

      for (let index = 0; index <= highestVisibleIndex; index++) {
        let rowTop = cards[index].offsetTop;
        let delayIndex = rowDelayIndexes.get(rowTop) ?? 0;
        rowDelayIndexes.set(rowTop, delayIndex + 1);

        if (cards[index].classList.contains("home-reveal-item-visible")) {
          continue;
        }

        cards[index].classList.add(`home-reveal-delay-${delayIndex}`);
        cards[index].classList.add("home-reveal-item-visible");
        observer.unobserve(cards[index]);
      }
    };

    let observer = new IntersectionObserver(
      (entries) => {
        let highestVisibleIndex = -1;
        for (let entry of entries) {
          if (entry.isIntersecting) {
            highestVisibleIndex = Math.max(
              highestVisibleIndex,
              cards.indexOf(entry.target as HTMLElement),
            );
          }
        }

        if (highestVisibleIndex >= 0) {
          revealThroughIndex(highestVisibleIndex);
        }
      },
      { rootMargin: "0px 0px 180px 0px", threshold: 0.01 },
    );

    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="general-home-page-content">
      <br />
      <div className="row">
        <div>
          <p className="fs-4 fw-bold">TIB Terminology Service</p>
          <p>
            With the Terminology Service, TIB – Leibniz Information Centre for
            Science and Technology and University Library provides a single
            point of access to terminologies from domains such as architecture,
            chemistry, computer science, mathematics and physics. You can browse
            ontologies through the website or use its API to retrieve
            terminological information and use it in your technical services.
          </p>
        </div>
      </div>
      <br></br>
      <div className="row">
        <div>
          <h2>Collections</h2>
        </div>
      </div>
      <br></br>
      <div className="row home-collection-grid" ref={collectionGridRef}>
        {Object.keys(collectionsInfoJson).map((collectionId, index) => {
          return (
            <div
              key={collectionId}
              className={
                "col-12 col-md-6 col-lg-4 mb-3 home-reveal-item " +
                (index === 0 ? "stour-collection-box-in-home" : "")
              }
            >
              <CollectionCard collectionId={collectionId} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

const CollectionCard = ({ collectionId }: { collectionId: string }) => {
  let subPath = process.env.REACT_APP_PROJECT_SUB_PATH;
  const collectionsInfo = collectionsInfoJson as CollectionsData;
  const collectionInfo = collectionsInfo[collectionId];

  return (
    <div className="collection-card text-center">
      {collectionId === "FID BAUdigital" && (
        <div className="alert alert-warning text-danger p-0 deprecated-collection-badge">
          Deprecated
        </div>
      )}
      <Link
        to={subPath + collectionInfo["ontology_list_url"]}
        className="collection-image-anchor"
      >
        <img
          className="img-fluid collection-card-logo"
          alt="collection_logo"
          src={collectionInfo["logo"]}
          loading="eager"
          height={collectionInfo["logo_height"] ?? 200}
          width={collectionInfo["logo_width"] ?? 300}
        />
      </Link>
      <div className="collection-card-text">
        <p className="trunc">{collectionInfo["text"]}</p>
        <Link
          to={subPath + "/collections?col=" + collectionInfo["html_id"]}
          className="show-more-text-link"
        >
          [Read More]
        </Link>
      </div>
    </div>
  );
};

export default RenderHomePage;
