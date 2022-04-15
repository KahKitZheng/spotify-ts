import React from "react";
import Track from "../Track";
import InfiniteLoader from "react-window-infinite-loader";
import { FixedSizeList as List } from "react-window";
import { useWindowSize } from "../../hooks/useWindowSize";
import { formatAddedAt } from "../../utils";

interface Props {
  hasNextPage: boolean;
  isNextPageLoading: boolean;
  items: any;
  loadNextPage: () => void;
  trackVariant: string;
}

const TrackLoader = (props: Props) => {
  const { hasNextPage, isNextPageLoading, items, loadNextPage } = props;
  const [windowWidth, windowHeight] = useWindowSize();

  // If there are more items to be loaded then add an extra row to hold a loading indicator.
  const itemCount = hasNextPage ? items.length + 1 : items.length;

  // Only load 1 page of items at a time.
  // Pass an empty callback to InfiniteLoader in case it asks us to load more than once.
  const loadMoreItems = isNextPageLoading
    ? () => {
        return;
      }
    : loadNextPage;

  // Every row is loaded except for our loading indicator row.
  const isItemLoaded = (index: number) => !hasNextPage || index < items.length;

  interface ItemProps {
    index: any;
    style: any;
  }

  // Render an item or a loading indicator.
  const Item = ({ index, style }: ItemProps) => {
    let content;

    if (!isItemLoaded(index)) {
      content = "Loading...";
    } else {
      content = (
        <Track
          variant="liked-songs"
          index={index}
          item={items[index]}
          addedAt={
            items[index].added_at !== null
              ? formatAddedAt(items[index].added_at)
              : ""
          }
        />
      );
    }

    return <div style={style}>{content}</div>;
  };

  return (
    <InfiniteLoader
      isItemLoaded={isItemLoaded}
      itemCount={itemCount}
      loadMoreItems={loadMoreItems}
    >
      {({ onItemsRendered, ref }) => (
        <List
          className="List"
          itemCount={itemCount}
          width={windowWidth}
          height={windowHeight}
          itemSize={64}
          onItemsRendered={onItemsRendered}
          ref={ref}
        >
          {Item}
        </List>
      )}
    </InfiniteLoader>
  );
};

export default TrackLoader;
