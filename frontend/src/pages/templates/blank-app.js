import React, { Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { history } from './store';
import { SET as SET_LAST_LOCATION } from './last-location-actions';
import Content from './Content';
import { PageHeader, PageFooter, TopScrollObserver } from './components';
import './App.css';

//------------------------------------------------------------
const setLastLocation = (lastLocation) => ({ type: SET_LAST_LOCATION, lastLocation });

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      smallHeader: false
    };
  }

  isShowingRootRoute() {
    const { currentLocation } = this.props;

    return currentLocation.pathname === '/';
  }

  onTopScroll = (scrolledDown) => {
    this.setState({
      smallHeader: scrolledDown
    });
  };

  componentDidMount() {
    const { setLastLocation } = this.props;

    history.listen(({ pathname, search, hash }) => {
      setLastLocation({ pathname, search, hash });
    });
  }

  render() {
    const { lastLocation, setLastLocation } = this.props;

    if (lastLocation && this.isShowingRootRoute()) {
      setLastLocation(null);
      return <Redirect to={lastLocation} />;
    }

    return (
      <Fragment>
        <TopScrollObserver onTopScroll={this.onTopScroll} />
        <div className="page-container">
          <PageHeader small={this.state.smallHeader} />
          <Content />
          <PageFooter />
        </div>
      </Fragment>
    );
  }
}

//------------------------------------------------------------
const mapStateToProps = ({ reducer_LastLocation, router }) => ({
  lastLocation: reducer_LastLocation.lastLocation,
  currentLocation: router.location
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      setLastLocation
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(App);
