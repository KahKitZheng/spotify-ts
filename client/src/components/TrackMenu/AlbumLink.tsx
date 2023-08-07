import * as M from "./TrackMenu.style";

const AlbumLink = (props: { albumId: string }) => {
  return (
    <M.OptionItemWrapper>
      <M.OptionLink to={`/album/${props.albumId}`}>Go to album</M.OptionLink>
    </M.OptionItemWrapper>
  );
};

export default AlbumLink;
