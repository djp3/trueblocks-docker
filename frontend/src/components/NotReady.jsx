import React, { Fragment } from 'react';
import { Loading } from './Loading';

//----------------------------------------------------------------
export class NotReady extends React.Component {
  render = () => {
    if (this.props.isLoading) {
      return <Loading source="caches" status="loading" message="Loading..." />;
    }

    if (this.props.error) {
      return <Loading source="caches" status="error" message={'Error: ' + this.props.error} />;
    }

    if (this.props.sysError) {
      return <Loading source="caches" status="error" message={'System error: ' + this.props.sysError} />;
    }

    return (
      <Fragment>
        <div style={{ color: 'red' }}>
          Unknown error: Is the TrueBlocks API running?
          <p />
          IS THE STATUS PANEL OPEN?????
          <p />
        </div>
      </Fragment>
    );
  };
}

//----------------------------------------------------------------
export const isError = function(props) {
  if (props.sysError || props.error) return true;
  return false;
};

//----------------------------------------------------------------
export const isReady = function(props, other_test) {
  if (!other_test) return false;
  if (props.isLoading) return false;
  if (!props.sysConnected) return false;
  // connected and not loading, so we're not ready if we have an error
  return !isError(props);
};

//----------------------------------------------------------------
export const isEmpty = function(data) {
  return !data || data.length === 0;
};

//----------------------------------------------------------------
export class EmptyQuery extends React.Component {
  render = () => {
    return <div>The query '{this.props.query}' produced no results.</div>;
  };
}
