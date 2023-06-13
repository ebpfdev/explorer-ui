import {Flash, StyledOcticon} from "@primer/react";
import React from "react";
import './styles.css';
import {useAppDispatch, useAppSelector} from "../../store/root";
import {XIcon} from "@primer/octicons-react";
import {flashActions} from "../../store/flashes";

export function FlashContainer() {
  const flashes = useAppSelector(state => state.flashes.flashes);
  const dispatch = useAppDispatch();

  return (
    <div className={'content-flashes'}>
      {flashes.map((flash, i) =>
        <Flash key={i} variant={flash.variant}>
          {flash.message}
          <span onClick={() => dispatch(flashActions.dismiss(flash.id))}>
            <StyledOcticon icon={XIcon} />
          </span>
        </Flash>)}
    </div>
  );
}
