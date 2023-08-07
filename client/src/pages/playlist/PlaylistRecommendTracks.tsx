import { Dispatch, SetStateAction } from "react";
import { useAppSelector } from "../../app/hooks";
import Track from "@/components/Track";
import * as P from "./playlist.style";
import * as T from "@/components/Track/Track.style";
import * as recommendationSlice from "@/slices/recommendationSlice";

interface Props {
  isSearching: boolean;
  setIsSearching: Dispatch<SetStateAction<boolean>>;
  refreshRecommendations: () => void;
}

const PlaylistRecommendTracks = (props: Props) => {
  const recommendedTracks = useAppSelector(
    recommendationSlice.selectRecommendedPlaylistTracks
  );

  return (
    <P.PlaylistDiscovery>
      <P.PlaylistDiscoveryHeaderWrapper>
        <div>
          <P.PlaylistDiscoveryName>Recommended</P.PlaylistDiscoveryName>
          <p>Based on what&apos;s in this playlist</p>
        </div>
        <P.ToggleDiscovery
          onClick={() => props.setIsSearching(!props.isSearching)}
        >
          Search songs
        </P.ToggleDiscovery>
      </P.PlaylistDiscoveryHeaderWrapper>
      <P.TracklistWrapper>
        <T.TrackList>
          {recommendedTracks.tracks?.map((track) => (
            <Track key={track.id} item={track} variant={"playlist-add-track"} />
          ))}
        </T.TrackList>
        <P.RefreshButtonWrapper>
          <P.RefreshButton onClick={props.refreshRecommendations}>
            refresh
          </P.RefreshButton>
        </P.RefreshButtonWrapper>
      </P.TracklistWrapper>
    </P.PlaylistDiscovery>
  );
};

export default PlaylistRecommendTracks;
