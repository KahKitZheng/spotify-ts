import React from "react";
import * as M from "./TrackMenu.style";
import { MdArrowRight } from "react-icons/md";
import { NestedPopover } from "../Popover";
import { SimplifiedArtist } from "../../types/SpotifyObjects";

const ArtistLinks = (props: { artistIds: SimplifiedArtist[] }) => {
  if (props.artistIds && props.artistIds.length === 1) {
    return (
      <M.OptionItemWrapper>
        <M.OptionLink to={`/artist/${props.artistIds[0].id}`}>
          Go to artist
        </M.OptionLink>
      </M.OptionItemWrapper>
    );
  } else if (props.artistIds && props.artistIds.length > 1) {
    return (
      <NestedPopover
        render={() => (
          <M.OptionsList>
            {props.artistIds.map((artist) => (
              <M.OptionItemWrapper key={artist.id}>
                <M.OptionLink to={`/artist/${artist.id}`}>
                  {artist.name}
                </M.OptionLink>
              </M.OptionItemWrapper>
            ))}
          </M.OptionsList>
        )}
      >
        <M.OptionItemWrapper>
          <M.OptionItemButton>Go to artist</M.OptionItemButton>
          <M.MoreOptionIcon>
            <MdArrowRight />
          </M.MoreOptionIcon>
        </M.OptionItemWrapper>
      </NestedPopover>
    );
  } else {
    return null;
  }
};

export default ArtistLinks;
