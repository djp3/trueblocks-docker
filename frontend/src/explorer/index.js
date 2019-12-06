import React from 'react';
import ConnectionComponent from '../components';

const Explorer = (props) => (
  <div className="page">
    <ConnectionComponent props={props} />
    <div className="right-panel">
      <h1>
        Explorer
        <div className="description-note">
          This is the TrueBlocks Explorer. This is the TrueBlocks Explorer.This is the TrueBlocks Explorer. This is the
          TrueBlocks Explorer. This is the TrueBlocks Explorer. This is the TrueBlocks Explorer.
        </div>
      </h1>
      <div className="inner-panel">
        <h4 className="inner-panel">Explorer Group 1</h4>
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
          <li>Item 3</li>
        </ul>
        <h4>Group 2</h4>
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
        </ul>
      </div>
    </div>
  </div>
);

export default Explorer;