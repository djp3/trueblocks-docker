//----------------------------------------------------------------------
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { dispatcher_Digests } from './dispatchers';

import { BreadCrumb } from '../../components';
import { isError, NotReady, isEmpty, EmptyQuery } from '../../components';
import './digests.css';

// EXISTING_CODE
import { Loading, Icon } from '../../components';
import * as di from './actions';
import '../../index.css';
var Utils = require('../../utils');
// EXISTING_CODE

//----------------------------------------------------------------------
class DigestsInner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cur_submenu: props.cur_submenu
    };
    // EXISTING_CODE
    // EXISTING_CODE
  }

  componentDidMount = () => {
    this.props.dispatcher_Digests(this.state.cur_submenu.route + '?' + this.state.cur_submenu.query);
  };

  // EXISTING_CODE
  // EXISTING_CODE

  getInnerPage = () => {
    if (this.state.cur_submenu.subpage === 'dashboard') return <div>The dashboard for Digests</div>;
    if (isError(this.props)) return <NotReady {...this.props} />;
    else if (isEmpty(this.props.data)) return <EmptyQuery query={this.state.subpage} />;
    // EXISTING_CODE
    return <SystemProgressChart {...this.props} />;
    // EXISTING_CODE
  };

  render = () => {
    return (
      <div className="inner-panel">
        <BreadCrumb page="Digests" menu={this.state.cur_submenu} />
        {this.getInnerPage()}
        {JSON.stringify(this.state)}
      </div>
    );
  };
}

// EXISTING_CODE
//----------------------------------------------------------------------
class SystemProgressChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      zoomStart: undefined
    };
  }

  clientHead = this.props.client === 'n/a' ? this.props.unripe : this.props.client;
  rows = Math.ceil(this.clientHead / 1e6);
  cols = 10;

  zoom = (zoomStart) => {
    this.setState({ ...this.state, zoomStart });
  };

  chart = (
    <div className="digests-chart-container">
      <div className="digests-grid"></div>
      {[...Array(this.cols).keys()].map((col, colI) => {
        return (
          <div className="digests-y-axis digests-grid" key={`x${col}`}>
            {Utils.fmtInteger(col * 1e5)}
          </div>
        );
      })}
      {[...Array(this.rows).keys()].map((row, rowI) => {
        return (
          <Fragment key={`x${row}`}>
            <div className="digests-x-axis digests-grid">{Utils.fmtInteger(row * 1e6)}</div>
            {[...Array(this.cols).keys()].map((col, colI) => {
              let indexClass;
              if (this.props.finalized >= row * 1e6 + (col + 1) * 1e5) {
                indexClass = 'finalized';
              } else if (this.props.finalized >= row * 1e6 + col * 1e5) {
                indexClass = 'in-progress';
              } else {
                indexClass = 'inactive';
              }
              return (
                <div className="digests-grid" key={`x${row}${col}`}>
                  <div className={`filling ${indexClass}`} onClick={() => this.zoom(row * 1e6 + col * 1e5)}>
                    {indexClass === 'finalized' && '✔'}
                  </div>
                </div>
              );
            })}
          </Fragment>
        );
      })}
    </div>
  );

  cache_chart = (
    <div className="inner-index">
      <h4>Caches</h4>
      <p> </p>
      <div className="digests-fun-facts">
        <div>
          <div className="digests-fact-top">{this.props.caches[0].type}:</div>
          <div>{this.props.caches[0].path.replace(this.props.index_path, '$indexPath/')}</div>
          <div>
            {Utils.fmtInteger(this.props.caches[0].sizeInBytes)} / {Utils.fmtInteger(this.props.caches[0].nFiles)} /{' '}
            {Utils.fmtDouble(this.props.caches[0].sizeInBytes / this.props.caches[0].nFiles, 1)}
          </div>
        </div>
        <div>
          <div className="digests-fact-top">{this.props.caches[1].type}:</div>
          <div>{this.props.caches[1].path.replace(this.props.cache_path, '$cachePath/')}</div>
          <div>
            {Utils.fmtInteger(this.props.caches[1].sizeInBytes)} / {Utils.fmtInteger(this.props.caches[1].nFiles)} /{' '}
            {Utils.fmtDouble(this.props.caches[1].sizeInBytes / this.props.caches[1].nFiles, 1)}
          </div>
        </div>
        <div>
          <div className="digests-fact-top">{this.props.caches[2].type}:</div>
          <div>{this.props.caches[2].path.replace(this.props.cache_path, '$cachePath/')}</div>
          <div>
            {Utils.fmtInteger(this.props.caches[2].sizeInBytes)} / {Utils.fmtInteger(this.props.caches[2].nFiles)} /{' '}
            {Utils.fmtDouble(this.props.caches[2].sizeInBytes / this.props.caches[2].nFiles, 1)}
          </div>
        </div>
        <div>
          <div className="digests-fact-top">{this.props.caches[3].type}:</div>
          <div>{this.props.caches[3].path.replace(this.props.cache_path, '$cachePath/')}</div>
          <div>
            {Utils.fmtInteger(this.props.caches[3].sizeInBytes)} / {Utils.fmtInteger(this.props.caches[3].nFiles)} /{' '}
            {Utils.fmtDouble(this.props.caches[3].sizeInBytes / this.props.caches[3].nFiles, 1)}
          </div>
        </div>
        <div>
          <div className="digests-fact-top">{this.props.caches[4].type}:</div>
          <div>{this.props.caches[4].path.replace(this.props.cache_path, '$cachePath/')}</div>
          <div>
            {Utils.fmtInteger(this.props.caches[4].sizeInBytes)} / {Utils.fmtInteger(this.props.caches[4].nFiles)} /{' '}
            {Utils.fmtDouble(this.props.caches[4].sizeInBytes / this.props.caches[4].nFiles, 1)}
          </div>
        </div>
      </div>
    </div>
  );

  render() {
    return (
      <div>
        {this.chart}
        <p> </p>
        {this.cache_chart}
        <p> </p>
        <ZoomOnIndex {...this.props} start={this.state.zoomStart} n={1e5} />
      </div>
    );
  }
}

//----------------------------------------------------------------------
// Without this, the !props.loadingIndex test below is always true until one clicks on the page after relaod
var been_here = false;
const ZoomOnIndex = (props) => {
  let readyContainer;
  const hasData = props.data[0].items !== undefined && props.start !== undefined;
  switch (hasData) {
    case true:
      const filteredData = props.data[0].items.filter(
        (item) => (item.firstAppearance >= props.start) & (item.firstAppearance < props.start + props.n)
      );
      readyContainer = (
        <div>
          <IndexDetail data={filteredData} range={{ start: props.start, end: props.start + props.n }} />
        </div>
      );
      break;
    default:
      if (!been_here && !props.loadingIndex) {
        been_here = true;
        props.dispatcher_Digests(di.FINALIZED);
      }
      readyContainer = props.start && <Loading source="digests" status="loading" message="Waiting for index data..." />;
  }

  return <div>{readyContainer}</div>;
};

//----------------------------------------------------------------------
const IndexDetail = (props) => {
  const count = props.data.length;
  const subtit =
    'Details: ' +
    (count ? count : 'No') +
    ' finalized chunks in block range ' +
    props.range.start +
    '-' +
    props.range.end;
  return (
    <div className="inner-index">
      <h4>{subtit}</h4>
      <div className="digests-index-container">
        {props.data.map((item) => (
          <div className="digests-index-node" key={`x${item.firstAppearance}`}>
            <div>bloom hash:</div>{' '}
            <div className="digests-inright_blue">
              {item.bloom_hash} <Icon icon="check_box" small onClick={null} />
            </div>
            <div>index hash:</div> <div className="digests-inright_blue">{item.index_hash}</div>
            <div>first block:</div> <div className="digests-inright">{Utils.fmtInteger(item.firstAppearance)}</div>
            <div>latest block:</div> <div className="digests-inright">{Utils.fmtInteger(item.latestAppearance)}</div>
            <div>nBlocks:</div>{' '}
            <div className="digests-inright">{Utils.fmtInteger(item.latestAppearance - item.firstAppearance + 1)}</div>
            <div>nAddresses:</div> <div className="digests-inright">{Utils.fmtInteger(item.nAddresses)}</div>
            <div>nAppearances:</div> <div className="digests-inright_red">{Utils.fmtInteger(item.nAppearances)}</div>
            <div>chunk size:</div> <div className="digests-inright">{Utils.humanFileSize(item.indexSizeBytes)}</div>
            <div>bloom size:</div> <div className="digests-inright">{Utils.humanFileSize(item.bloomSizeBytes)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
// EXISTING_CODE

//----------------------------------------------------------------------
const mapStateToProps = ({ reducer_SidePanels, reducer_Status, reducer_Digests }) => ({
  // EXISTING_CODE
  caches: reducer_Status.systemData.caches,
  index_path: reducer_Status.systemData.index_path,
  cache_path: reducer_Status.systemData.cache_path,
  unripe: reducer_Status.unripe,
  staging: reducer_Status.staging,
  finalized: reducer_Status.finalized,
  client: reducer_Status.client,
  loadingIndex: reducer_Digests.isLoading,
  // EXISTING_CODE
  sysConnected: reducer_SidePanels.isStatusExpanded ? reducer_Status.isConnected : true,
  sysError: reducer_SidePanels.isStatusExpanded ? reducer_Status.error : false,
  isLoading: reducer_Digests.isLoading,
  error: reducer_Digests.error,
  data: reducer_Digests.data,
  meta: reducer_Digests.meta
});

//----------------------------------------------------------------------
const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      // EXISTING_CODE
      // EXISTING_CODE
      dispatcher_Digests
    },
    dispatch
  );

//----------------------------------------------------------------------
export default connect(mapStateToProps, mapDispatchToProps)(DigestsInner);
