import React from 'react';
import { Text, View, StyleSheet, BackHandler, Platform, Image, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { onShowHeaderRunway } from '../../redux/actions/RunwayAction';
import Flurry from 'react-native-flurry-sdk';
import Colors from '../../constants/colors/colors';
import {
  handleAndroidBackButton,
  removeAndroidBackButtonHandler,
} from '../../helpers/androidBackButton';
import translate from '../../assets/strings/strings';
import FontFamily from '../../assets/fonts/fonts';
import { onLoadMore } from '../../redux/actions/HomeAction';
import { verticalScale, horizontalScale, moderateScale } from '../../helpers/scale';
import { Images } from '../../assets/images';
import RunwayCards from './RunwayCards';
import { parentEnabled, childEnabled, useStaticLable } from '../../../appConfig';
import automationStaticLables from '../../constants/automationStaticLables';
import ClickView from '../../components/widgets/clickView';
import TopBarHeader from '../../components/header/TopBarHeader';
import apiService from '../../service/fetchContentService/FetchContentService';
import ActivityIndicatorView from '../../components/widgets/ActivityIndicator';
import { ApiPaths, ApiMethods } from '../../service/config/serviceConstants';
import EmptyComponent from '../../components/widgets/EmptyComponent';
import { ModalView } from '../../components/widgets/ModalView';
import { NavigationEvents } from 'react-navigation';

class RunwayScreen extends React.Component {
  onEndReachedCalledDuringMomentum: boolean;
  constructor(props: any) {
    super(props);
    this.state = {
      runwayData: [],
      loading: true,
      refreshing: false,
      filterModal: false,
      filterSelectionModal: false,
      seasonSelected: false,
      citiesSelected: false,
      designersSelected: false,
      filterData: [],
      seasonSelectedData: '',
      citiesSelectedData: [],
      designersSelectedData: [],
      filter: false,
      selectedDesigners: [],
      selectedCities: [],
      selectedSeason: '',
      designer: '',
      cities: '',
      season: '',
      isNetworkIssue: false,
      navPayload: '',
      isLoadMore: false,
      pageNo: 1,
      citiesList: [],
      designersList: [],
    };

    this.onEndReachedCalledDuringMomentum = true;

    this._navListener = this.props.navigation.addListener('didFocus', () => {
      if (
        this.state.navPayload &&
        this.state.navPayload.action &&
        this.state.navPayload.action.type === 'Navigation/JUMP_TO'
      ) {
        this.setState({
          filter: false,
          seasonSelectedData: '',
          citiesSelectedData: [],
          designersSelectedData: [],
        });
      }
    });
  }

  componentDidMount() {
    Flurry.logEvent('Runway screen inoked');
    this.initialFetch();

    this._navListener = this.props.navigation.addListener('didFocus', () => {
      handleAndroidBackButton(() => {
        BackHandler.exitApp();
      });
    });
  }

  getSnapshotBeforeUpdate = (oldProps: any, oldState: any) => {
    if (oldState.seasonSelectedData !== this.state.seasonSelectedData) {
      return true;
    } else {
      return false;
    }
  };

  componentDidUpdate(oldProps: any, oldState: any, snapShot: any) {
    if (snapShot) {
      this.setState({ citiesSelectedData: [], designersSelectedData: [] });
      if (oldState.citiesSelectedData !== this.state.citiesSelectedData) {
        this.setState({ designersSelectedData: [] });
      }
    }
    if (oldState.citiesSelectedData !== this.state.citiesSelectedData) {
      this.setState({ designersSelectedData: [] });
    }
  }

  initialFetch = () => {
    apiService(ApiPaths.RUNWAY_FILTERS, ApiMethods.GET, this.onFilterSuccess, this.onFilterFailure);
  };

  renderApiData = (selectedSeason: any, pageNo: Number) => {
    this.setState({ citiesSelected: [], designersSelected: [] });
    apiService(
      ApiPaths.RUNWAY_APPLY_FILTEER + selectedSeason + '&page=' + pageNo,
      ApiMethods.GET,
      this.onApplyFilterSuccess,
      this.onApplyFilterFailure,
    );
  };

  onPull = () => {
    this.setState({ refreshing: true, pageNo: 1 }, () => {
      if (this.state.filter) {
        this.handleFilterApiCall(1);
      } else {
        this.renderApiData(this.state.selectedSeason, 1);
      }
    });
  };

  onRefresh = () => {
    this.setState({ loading: true, pageNo: 1 }, () => {
      const { selectedSeason }: any = this.state;
      this.renderApiData(selectedSeason, 1);
    });
  };

  handlePagination = () => {
    const { selectedSeason, isLoadMore, filter, pageNo, runwayData }: any = this.state;

    if (!isLoadMore && runwayData && runwayData.length % 10 === 0) {
      this.setState({ pageNo: pageNo + 1, isLoadMore: true }, () => {
        if (filter) {
          this.handleFilterApiCall(pageNo + 1);
        } else {
          this.renderApiData(selectedSeason, pageNo + 1);
        }
      });
    }
  };

  onFilterSuccess = (response: any) => {
    if (response && response.data && response.data.seasons) {
      this.setState(
        {
          filterData: response.data.seasons,
          seasonSelected: false,
          citiesSelected: false,
          designersSelected: false,
          loading: false,
          isNetworkIssue: false,
        },
        () => {
          if (response.data.seasons.length > 0) {
            this.setState({
              selectedSeason: response.data.seasons[0].id,
              season: response.data.seasons[0].name,
              seasonSelectedData: response.data.seasons[0],
            });
          }

          this.renderApiData(response.data.seasons[0].id, 1);
          this.handleFilterData(response.data.seasons[0].id);
        },
      );
    }
  };

  onFilterFailure = (error: any) => {
    if (error === translate('no_internet')) {
      this.setState({ isNetworkIssue: true });
    } else {
      this.setState({ loading: false, isNetworkIssue: false });
    }
  };

  handleFilterData = async (selectedSeason: any) => {
    const { filterData }: any = this.state;

    this.setState({ selectedCities: [], selectedDesigners: [] });

    if (filterData.length > 0) {
      const filteredResults = await filterData.filter((o) => o.id === selectedSeason);

      if (filteredResults.length > 0) {
        var citiesList = filteredResults[0].cities;
        let designersList: any[] = [];
        let designersFiltered: any[] = [];
        let uniqueIDs: never[] = [];

        if (citiesList.length > 0) {
          citiesList.map((city: any) => {
            designersList = [...designersList, ...city.collections];
          });

          if (designersList.length > 0) {
            // Removing duplicates
            designersList.map((design) => {
              if (!uniqueIDs.includes(design.id)) {
                designersFiltered.push(design);
                uniqueIDs.push(design.id);
              }
            });

            // Sorting designers by designer name
            designersFiltered.sort(function (a, b) {
              return a.name > b.name;
            });
          }
        }

        this.setState({
          citiesList: filteredResults[0].cities,
          designersList: designersFiltered,
        });
      }
    }
  };

  componentWillUnmount() {
    removeAndroidBackButtonHandler();
  }

  runwayHeader = () => {
    const { filter, season, selectedSeason, selectedCities, selectedDesigners }: any = this.state;
    return (
      <View style={styles.headerContainer}>
        <View style={styles.headerMainView}>
          <View accessible={parentEnabled} style={styles.mainHeaderView}>
            <Text
              accessible={childEnabled}
              accessibilityRole={'text'}
              accessibilityLabel={translate('runway')}
              testID={translate('runway')}
              style={styles.headerText}
            >
              {translate('runway')}
            </Text>
            <Text
              accessible={childEnabled}
              accessibilityRole={'text'}
              accessibilityLabel={
                useStaticLable ? automationStaticLables.runwaySeason : 'runwaySeason'
              }
              testID={useStaticLable ? automationStaticLables.runwaySeason : 'runwaySeason'}
              style={styles.subHeaderText}
            >
              {season}
            </Text>
          </View>

          <View accessible={parentEnabled} style={styles.subHeaderView}>
            <ClickView
              accessible={parentEnabled}
              style={filter ? styles.activeFilterView : styles.headerFilterView}
              onPress={() => {
                this.setState({ filterModal: true });
              }}
            >
              <Text
                accessible={childEnabled}
                accessibilityRole={'button'}
                accessibilityLabel={translate('filters')}
                testID={translate('filters')}
                style={[styles.filterText, filter ? styles.activeFilterText : null]}
              >
                {translate('filters')}
                {filter && selectedSeason !== ''
                  ? ' (' + (1 + selectedCities.length + selectedDesigners.length) + ')'
                  : null}
              </Text>
              <Image
                source={Images.caratDownBlack}
                style={[styles.filterIcon, filter ? styles.activeFilterIcon : null]}
              />
            </ClickView>
          </View>
        </View>
        <View style={styles.headerSeparator} />
      </View>
    );
  };

  renderFilterHeader = () => {
    return (
      <View accessible={parentEnabled} style={styles.filterHeader}>
        <View style={styles.cancelIcon} />
        <Text
          accessible={childEnabled}
          accessibilityLabel={automationStaticLables.filter}
          testID={automationStaticLables.filter}
          style={styles.filterModalText}
        >
          {translate('filter')}
        </Text>
        <ClickView
          accessible={parentEnabled}
          style={styles.cancelIcon}
          onPress={() => {
            this.setState({ filterModal: false });
          }}
        >
          <Image
            accessible={childEnabled}
            accessibilityLabel={automationStaticLables.close}
            testID={automationStaticLables.close}
            source={Images.close}
          />
        </ClickView>
      </View>
    );
  };

  renderFilterTypeHeader = () => {
    return (
      <View accessible={parentEnabled} style={styles.filterHeader}>
        <ClickView
          accessible={parentEnabled}
          style={styles.cancelIcon}
          onPress={() => {
            this.setState({
              filterSelectionModal: false,
              seasonSelected: false,
              citiesSelected: false,
              designersSelected: false,
            });
          }}
        >
          <Image
            accessible={childEnabled}
            accessibilityLabel={automationStaticLables.close}
            testID={automationStaticLables.close}
            source={Images.arrowLeft}
          />
        </ClickView>
        <Text
          accessible={childEnabled}
          accessibilityLabel={automationStaticLables.filter}
          testID={automationStaticLables.filter}
          style={styles.filterModalText}
        >
          {translate('filter')}
        </Text>
        <View style={styles.cancelIcon} />
      </View>
    );
  };

  renderFilterTypes = () => {
    const {
      season,
      citiesList,
      designersList,
      selectedCities,
      selectedDesigners,
    }: any = this.state;
    const seasonName = season !== '' ? season : translate('season');
    const citiesName =
      selectedCities.length === 0 || selectedCities.length === citiesList.length
        ? translate('allCities')
        : translate('cities') + ' (' + selectedCities.length + ') ';
    const designerName =
      selectedDesigners.length === 0 || selectedDesigners.length === designersList.length
        ? translate('allDesigners')
        : translate('designers') + ' (' + selectedDesigners.length + ') ';

    return (
      <View accessible={parentEnabled} style={styles.filterTypesContainer}>
        <ClickView
          style={styles.filterTypeView}
          accessible={parentEnabled}
          onPress={() => {
            this.setState({
              filterSelectionModal: true,
              seasonSelected: true,
              citiesSelected: false,
              designersSelected: false,
            });
          }}
        >
          <Text
            accessible={childEnabled}
            accessibilityRole={'text'}
            accessibilityLabel={useStaticLable ? automationStaticLables.season : seasonName}
            testID={useStaticLable ? automationStaticLables.season : seasonName}
            style={[styles.filterTypeText, styles.selectedColor]}
          >
            {seasonName}
          </Text>
          <Image
            accessible={childEnabled}
            testID={automationStaticLables.expand}
            source={Images.arrow}
            style={[styles.icon, styles.selectedIcon]}
          />
        </ClickView>

        <ClickView
          style={styles.filterTypeView}
          accessible={parentEnabled}
          onPress={() => {
            this.setState({
              filterSelectionModal: true,
              seasonSelected: false,
              citiesSelected: true,
              designersSelected: false,
            });
          }}
        >
          <Text
            accessible={childEnabled}
            accessibilityRole={'text'}
            accessibilityLabel={useStaticLable ? automationStaticLables.cities : citiesName}
            testID={useStaticLable ? automationStaticLables.cities : citiesName}
            style={[styles.filterTypeText, styles.selectedColor]}
          >
            {citiesName}
          </Text>
          <Image
            accessible={childEnabled}
            source={Images.arrow}
            testID={automationStaticLables.expand}
            style={[styles.icon, styles.selectedIcon]}
          />
        </ClickView>

        <ClickView
          accessible={parentEnabled}
          style={styles.filterTypeView}
          onPress={() => {
            this.setState({
              filterSelectionModal: true,
              seasonSelected: false,
              citiesSelected: false,
              designersSelected: true,
            });
          }}
        >
          <Text
            accessible={childEnabled}
            accessibilityRole={'text'}
            accessibilityLabel={useStaticLable ? automationStaticLables.designer : designerName}
            testID={useStaticLable ? automationStaticLables.designer : designerName}
            style={[styles.filterTypeText, styles.selectedColor]}
          >
            {designerName}
          </Text>
          <Image
            accessible={childEnabled}
            source={Images.arrow}
            testID={automationStaticLables.expand}
            style={[styles.icon, styles.selectedIcon]}
          />
        </ClickView>
      </View>
    );
  };

  applyFilter = () => {
    if (this.state.season !== '') {
      this.setState({ loading: true, filterModal: false, filter: true });
      this.handleFilterApiCall(1);
    }
  };

  handleFilterApiCall = (pageNo: Number) => {
    const { selectedSeason, selectedCities, selectedDesigners }: any = this.state;

    apiService(
      ApiPaths.RUNWAY_APPLY_FILTEER +
        selectedSeason +
        '&city=' +
        selectedCities.toString() +
        '&collection=' +
        selectedDesigners.toString() +
        '&page=' +
        pageNo,
      ApiMethods.GET,
      this.onApplyFilterSuccess,
      this.onApplyFilterFailure,
    );
  };

  onApplyFilterSuccess = (response: any) => {
    const { pageNo, runwayData, filter }: any = this.state;

    if (response && response.data && response.data.items) {
      this.setState({
        runwayData: pageNo === 1 ? response.data.items : [...runwayData, ...response.data.items],
      });
    }

    if (pageNo === 1 && !filter) {
      this.setState({
        seasonSelected: false,
        citiesSelected: false,
        designersSelected: false,
      });
    }

    this.setState({
      loading: false,
      refreshing: false,
      isNetworkIssue: false,
      isLoadMore: false,
    });
  };

  onApplyFilterFailure = (error: any) => {
    if (error === translate('no_internet')) {
      this.setState({ loading: false, isNetworkIssue: true });
    } else {
      this.setState({ loading: false, isNetworkIssue: false });
    }
  };

  resetFilters = () => {
    const { filterData }: any = this.state;
    this.setState(
      {
        selectedSeason: filterData.length > 0 ? filterData[0].id : '',
        season: filterData.length > 0 ? filterData[0].name : '',
        seasonSelectedData: filterData.length > 0 ? filterData[0] : '',
        selectedCities: [],
        selectedDesigners: [],
        filterModal: false,
        filter: false,
        pageNo: 1,
      },
      () => {
        this.renderApiData(filterData.length > 0 ? filterData[0].id : '', 1);
      },
    );
  };

  renderFilterFooter = () => {
    const { season }: any = this.state;
    return (
      <View accessible={parentEnabled} style={styles.footerView}>
        <ClickView
          accessible={parentEnabled}
          disabled={season === '' ? true : false}
          accessibilityState={season === '' ? false : true}
          onPress={() => {
            this.setState({ loading: true }, () => {
              this.resetFilters();
            });
          }}
          style={styles.resetAllView}
        >
          <Text
            accessible={childEnabled}
            accessibilityLabel={translate('resetAll')}
            testID={translate('resetAll')}
            style={
              season === ''
                ? [styles.resetAll, styles.disableColor]
                : [styles.resetAll, styles.enableColor]
            }
          >
            {translate('resetAll')}
          </Text>
        </ClickView>
        <ClickView
          accessible={parentEnabled}
          accessibilityRole={'button'}
          disabled={season !== '' ? false : true}
          onPress={() => {
            this.setState({ pageNo: 1 });
            this.applyFilter();
          }}
          style={
            season !== ''
              ? [styles.applyFilterView, styles.enableBgColor]
              : [styles.applyFilterView, styles.disableBgColor]
          }
        >
          <Text
            accessible={childEnabled}
            accessibilityLabel={automationStaticLables.applyFilter}
            testID={automationStaticLables.applyFilter}
            style={styles.applyFilter}
          >
            {translate('applyFilter')}
          </Text>
        </ClickView>
      </View>
    );
  };

  renderTypeFooter = () => {
    const { citiesSelected, selectedCities, selectedDesigners }: any = this.state;

    let textStyle = [];
    if (citiesSelected) {
      textStyle =
        selectedCities.length === 0
          ? [styles.resetAll, styles.disableColor]
          : [styles.resetAll, styles.enableColor];
    } else {
      textStyle =
        selectedDesigners.length === 0
          ? [styles.resetAll, styles.disableColor]
          : [styles.resetAll, styles.enableColor];
    }

    return (
      <View accessible={parentEnabled} style={styles.footerView}>
        <ClickView
          accessible={parentEnabled}
          disabled={citiesSelected ? selectedCities.length === 0 : selectedDesigners.length === 0}
          accessibilityState={
            citiesSelected ? selectedCities.length === 0 : selectedDesigners.length === 0
          }
          onPress={() => {
            citiesSelected
              ? this.setState({ selectedCities: [] })
              : this.setState({ selectedDesigners: [] });
          }}
          style={styles.resetAllView}
        >
          <Text
            accessible={childEnabled}
            accessibilityLabel={translate('resetAll')}
            testID={translate('resetAll')}
            style={textStyle}
          >
            {translate('resetAll')}
          </Text>
        </ClickView>
      </View>
    );
  };

  renderTypeHeader = () => {
    const { citiesSelected, designersSelected }: any = this.state;
    var headerTitle = citiesSelected
      ? translate('cities')
      : designersSelected
      ? translate('designers')
      : translate('selectSeason');

    return (
      <View accessible={parentEnabled}>
        <Text
          accessible={childEnabled}
          accessibilityLabel={headerTitle}
          testID={headerTitle}
          style={styles.typeText}
        >
          {headerTitle}
        </Text>
      </View>
    );
  };

  renderSelectionItem = ({ item }: any) => {
    const { selectedSeason }: any = this.state;
    const season = item && item.name;
    return (
      <ClickView
        accessible={parentEnabled}
        onPress={() => {
          this.setState(
            {
              filterSelectionModal: false,
              seasonSelectedData: item,
              seasonSelected: false,
              selectedSeason: item && item.id,
              season: season,
            },
            () => {
              this.handleFilterData(item.id);
            },
          );
        }}
        style={[styles.selectTextView, styles.seasonSelectView]}
      >
        <Text
          accessible={childEnabled}
          accessibilityLabel={useStaticLable ? automationStaticLables.seasonTypes : season}
          testID={useStaticLable ? automationStaticLables.seasonTypes : season}
          style={styles.selectText}
        >
          {season}
        </Text>

        {selectedSeason === item.id ? <Image source={Images.check} /> : null}
      </ClickView>
    );
  };

  renderCitiesItem = ({ item }: any) => {
    const { selectedCities }: any = this.state;
    const cityName = item && item.name;
    return (
      <ClickView
        accessible={parentEnabled}
        onPress={() => this.handleCitySelect(item.id)}
        style={styles.selectTextView}
      >
        <View
          style={[styles.checkBox, selectedCities.includes(item.id) ? styles.activeCheckBox : null]}
        />
        <Text
          accessible={childEnabled}
          accessibilityLabel={useStaticLable ? automationStaticLables.cityTypes : cityName}
          testID={useStaticLable ? automationStaticLables.cityTypes : cityName}
          style={styles.selectText}
        >
          {cityName}
        </Text>
      </ClickView>
    );
  };

  handleCitySelect = (city: any) => {
    let { selectedCities }: any = this.state;

    if (selectedCities.includes(city)) {
      const city_index = selectedCities.indexOf(city);
      selectedCities.splice(city_index, 1);
    } else selectedCities.push(city);

    this.setState({
      selectedCities: selectedCities,
    });
  };

  renderDesignerItem = ({ item }: any) => {
    const { selectedDesigners }: any = this.state;
    const designerName = item && item.name;
    return (
      <ClickView
        accessible={parentEnabled}
        onPress={() => this.handleDesignerSelect(item.id)}
        style={styles.selectTextView}
      >
        <View
          style={[
            styles.checkBox,
            selectedDesigners.includes(item.id) ? styles.activeCheckBox : null,
          ]}
        />
        <Text
          accessible={childEnabled}
          accessibilityLabel={useStaticLable ? automationStaticLables.designerTypes : designerName}
          testID={useStaticLable ? automationStaticLables.designerTypes : designerName}
          style={styles.selectText}
        >
          {designerName}
        </Text>
      </ClickView>
    );
  };

  handleDesignerSelect = (designer: any) => {
    let { selectedDesigners }: any = this.state;

    if (selectedDesigners.includes(designer)) {
      const design_index = selectedDesigners.indexOf(designer);
      selectedDesigners.splice(design_index, 1);
    } else selectedDesigners.push(designer);

    this.setState({
      selectedDesigners: selectedDesigners,
    });
  };

  itemSeparator = () => {
    return <View style={styles.separator} />;
  };

  renderTypeBody = () => {
    const {
      filterData,
      seasonSelected,
      citiesSelected,
      designersSelected,
      citiesList,
      designersList,
    }: any = this.state;
    return (
      <View style={styles.flatlistView}>
        {seasonSelected && (
          <FlatList
            data={filterData}
            renderItem={this.renderSelectionItem}
            extraData={this.state}
            style={styles.flatlist}
            keyExtractor={(x, i) => i.toString()}
            ItemSeparatorComponent={this.itemSeparator}
            bounces={false}
          />
        )}

        {citiesSelected && (
          <FlatList
            data={citiesList}
            renderItem={this.renderCitiesItem}
            extraData={this.state}
            style={styles.flatlist}
            keyExtractor={(x, i) => i.toString()}
            ItemSeparatorComponent={this.itemSeparator}
            bounces={false}
          />
        )}

        {designersSelected && (
          <FlatList
            data={designersList}
            renderItem={this.renderDesignerItem}
            extraData={this.state}
            style={styles.flatlist}
            keyExtractor={(x, i) => i.toString()}
            ItemSeparatorComponent={this.itemSeparator}
            bounces={false}
          />
        )}
      </View>
    );
  };

  renderFitersSelection = () => {
    const { filterSelectionModal, citiesSelected, designersSelected }: any = this.state;
    if (filterSelectionModal) {
      return (
        <ModalView
          backdropColor={Colors.white}
          backdropOpacity={0.9}
          isVisible={filterSelectionModal}
          customColor={Colors.white}
          style={styles.filterSubModal}
          animationIn={'fadeIn'}
          transparent={true}
          onBackButtonPress={() => {
            this.setState({ filterSelectionModal: false });
          }}
          backDropPressed={() => {}}
        >
          <View style={styles.filterView}>
            {this.renderFilterTypeHeader()}
            {this.renderTypeHeader()}
            {this.renderTypeBody()}
            {citiesSelected || designersSelected ? this.renderTypeFooter() : null}
          </View>
        </ModalView>
      );
    }
  };

  renderFilterModal = () => {
    const { filterModal }: any = this.state;
    if (filterModal) {
      return (
        <ModalView
          backdropColor={Colors.white}
          backdropOpacity={0.9}
          isVisible={filterModal}
          customColor={Colors.white}
          style={styles.bottomModal}
          transparent={true}
          onBackButtonPress={() => {
            this.setState({ filterModal: false });
          }}
          backDropPressed={() => {}}
        >
          <View style={styles.filterView}>
            {this.renderFilterHeader()}
            {this.renderFilterTypes()}
            {this.renderFilterFooter()}
            {this.renderFitersSelection()}
          </View>
        </ModalView>
      );
    }
  };

  render() {
    const { runwayData, loading, refreshing, filter, isNetworkIssue, isLoadMore }: any = this.state;

    const { showHeader, onShowHeaderRunway }: any = this.props;

    if (isNetworkIssue) {
      return (
        <View>
          {Platform.OS === 'ios' && <View style={styles.statusBar} />}
          <TopBarHeader navigationany={this.props.navigation} />
          <EmptyComponent
            onPress={() => this.initialFetch()}
            errorText={translate('internet_connection')}
          />
        </View>
      );
    } else {
      return (
        <View style={styles.containerView}>
          <NavigationEvents
            onWillFocus={(payload) => {
              // Clear filters if already filtered on tab change
              if (payload.action.type === 'Navigation/JUMP_TO' && this.state.filter) {
                this.setState({ loading: true }, () => {
                  this.resetFilters();
                });
              }
              onShowHeaderRunway(true);
              this.setState({ navPayload: payload });
            }}
          />

          {Platform.OS === 'ios' && <View style={styles.statusBar} />}

          {showHeader ? <TopBarHeader navigationany={this.props.navigation} /> : null}

          {loading ? (
            <View style={styles.loadingview}>
              <ActivityIndicatorView />
            </View>
          ) : (
            <View style={styles.containerView}>
              {this.runwayHeader()}

              {filter === true && runwayData.length > 0 ? (
                <Text style={styles.filterSelectedText}>
                  {'Showing ' + runwayData.length}
                  {runwayData.length === 1 ? ' Result' : ' Results'}
                </Text>
              ) : null}

              <View style={styles.container}>
                {runwayData && runwayData.length > 0 ? (
                  <RunwayCards
                    {...this.props}
                    runwayData={runwayData}
                    refreshing={refreshing}
                    loadMore={isLoadMore}
                    handlePagination={this.handlePagination}
                    handlePullRefresh={this.onPull}
                    handleRefresh={this.onRefresh}
                  />
                ) : null}
              </View>
            </View>
          )}
          {this.renderFilterModal()}
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  containerView: {
    flex: 1,
  },
  container: {
    flex: 1,
    marginHorizontal: horizontalScale(14),
  },
  headerContainer: {
    marginLeft: horizontalScale(14),
    marginRight: horizontalScale(18),
    marginTop: verticalScale(10),
  },
  headerMainView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mainHeaderView: {
    alignSelf: 'flex-start',
    width: '75%',
  },
  headerText: {
    fontSize: moderateScale(27),
    fontFamily:
      Platform.OS === 'ios'
        ? FontFamily.publicoBannerMediumIos
        : FontFamily.publicoBannerMediumAndroid,
    lineHeight: verticalScale(32),
    color: Colors.black,
  },
  subHeaderView: {
    justifyContent: 'flex-end',
    paddingBottom: verticalScale(6),
  },
  subHeaderText: {
    marginTop: moderateScale(-5),
    marginRight: horizontalScale(10),
    fontSize: moderateScale(18),
    fontFamily: FontFamily.fontFamilyRegular,
    lineHeight: verticalScale(28),
    color: Colors.black,
  },
  headerFilterView: {
    flexDirection: 'row',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowColor: Colors.lightGrey,
    shadowOpacity: 1,
    elevation: 2,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: horizontalScale(12),
    marginTop: verticalScale(-6),
    borderRadius: moderateScale(15),
  },
  activeFilterView: {
    flexDirection: 'row',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: horizontalScale(10),
    marginTop: verticalScale(-6),
    borderRadius: moderateScale(15),
    borderColor: Colors.red,
    borderWidth: 1,
    borderStyle: 'solid',
  },
  filterText: {
    fontSize: moderateScale(12),
    lineHeight: verticalScale(24),
    letterSpacing: moderateScale(0.6),
    fontFamily: FontFamily.fontFamilyRegular,
  },
  activeFilterText: {
    color: Colors.red,
  },
  filterIcon: {
    marginLeft: horizontalScale(5),
    tintColor: Colors.black,
  },
  activeFilterIcon: {
    tintColor: Colors.red,
  },
  filter: {
    fontSize: moderateScale(9),
    lineHeight: verticalScale(11),
    fontFamily: FontFamily.fontFamilyRegular,
    alignSelf: 'center',
  },
  filterTrue: {
    color: Colors.red,
  },
  filterFalse: {
    color: Colors.eclipseGrey,
  },
  headerSeparator: {
    width: horizontalScale(346),
    height: verticalScale(5),
    marginVertical: verticalScale(5),
    backgroundColor: Colors.black,
  },
  textLable: {
    marginTop: moderateScale(50),
    fontSize: moderateScale(25),
  },
  statusBar: {
    backgroundColor: Colors.white,
    height: moderateScale(30),
    width: '100%',
    zIndex: 2,
  },
  loadingview: {
    marginTop: verticalScale(318),
  },
  filterView: {
    width: '100%',
    height: verticalScale(700),
    backgroundColor: Colors.white,
    borderTopLeftRadius: moderateScale(18),
    borderTopRightRadius: moderateScale(18),
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
    backgroundColor: Colors.GainsboroGrey,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: verticalScale(25),
    marginHorizontal: horizontalScale(25),
  },
  filterModalText: {
    fontSize: moderateScale(23),
    fontFamily: FontFamily.fontFamilyMedium,
    color: Colors.black,
  },
  cancelIcon: {
    paddingHorizontal: horizontalScale(10),
    paddingBottom: verticalScale(10),
    paddingTop: verticalScale(5),
    minWidth: horizontalScale(50),
  },
  filterTypeText: {
    fontSize: moderateScale(20),
    fontFamily: FontFamily.fontFamilyBold,
    flexShrink: 1,
  },
  selectedColor: {
    color: Colors.black,
  },
  unSelectedColor: {
    color: Colors.Gray75,
  },
  filterTypeView: {
    width: horizontalScale(341),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: horizontalScale(22),
    borderWidth: 1,
    borderRadius: moderateScale(10),
    borderColor: Colors.lightGrey,
    marginBottom: verticalScale(25),
    paddingVertical: verticalScale(12),
  },
  filterTypesContainer: {
    marginTop: verticalScale(40),
    alignSelf: 'center',
  },
  selectedIcon: {
    tintColor: Colors.black,
  },
  unSelectedIcon: {
    tintColor: Colors.Gray75,
  },
  icon: {
    width: moderateScale(15),
    height: moderateScale(15),
  },
  footerView: {
    height: verticalScale(60),
    width: horizontalScale(375),
    borderTopWidth: 1,
    borderColor: 'rgba(216,216,216,0.6)',
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  resetAllView: {
    paddingLeft: horizontalScale(21),
  },
  resetAll: {
    fontSize: moderateScale(15),
    fontFamily: FontFamily.fontFamilyRegular,
  },
  applyFilter: {
    fontSize: moderateScale(17),
    fontFamily: FontFamily.fontFamilyBold,
    color: Colors.white,
  },
  disableColor: {
    color: Colors.viewAllGrey,
  },
  enableColor: {
    color: Colors.backgroundRed,
  },
  disableBgColor: {
    backgroundColor: Colors.viewAllGrey,
  },
  enableBgColor: {
    backgroundColor: Colors.backgroundRed,
  },
  applyFilterView: {
    width: horizontalScale(147),
    height: verticalScale(60),
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterSubModal: {
    margin: 0,
    backgroundColor: Colors.GainsboroGrey,
    justifyContent: 'flex-end',
  },
  typeText: {
    fontSize: moderateScale(20),
    fontFamily: FontFamily.fontFamilyBold,
    color: Colors.black,
    marginTop: verticalScale(30),
    marginLeft: horizontalScale(40),
  },
  selectText: {
    fontSize: moderateScale(18),
    fontFamily: FontFamily.fontFamilyMedium,
    color: Colors.black,
    flexShrink: 1,
  },
  selectTextView: {
    width: horizontalScale(339),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(15),
  },
  seasonSelectView: {
    justifyContent: 'space-between',
  },
  checkBox: {
    height: verticalScale(16),
    width: horizontalScale(16),
    borderRadius: moderateScale(4),
    backgroundColor: Colors.white,
    borderColor: Colors.darkGrey,
    borderWidth: 0.5,
    borderStyle: 'solid',
    marginRight: horizontalScale(10),
  },
  activeCheckBox: {
    backgroundColor: Colors.grey,
    borderWidth: 0,
  },
  flatlist: {
    marginTop: verticalScale(15),
    marginLeft: horizontalScale(18),
    marginRight: horizontalScale(16),
    borderWidth: 1,
    borderColor: Colors.lightGrey,
    borderRadius: moderateScale(10),
    marginBottom: verticalScale(110),
  },
  flatlistCity: {
    borderWidth: 1,
    borderColor: Colors.lightGrey,
    borderRadius: moderateScale(10),
    marginLeft: horizontalScale(18),
    marginRight: horizontalScale(16),
  },
  separator: {
    width: horizontalScale(339),
    height: 1,
    backgroundColor: Colors.lightGrey,
  },
  flatlistView: {
    marginBottom: verticalScale(20),
  },
  filterSelectedText: {
    fontSize: moderateScale(12),
    lineHeight: moderateScale(24),
    fontFamily: FontFamily.fontFamilyRegular,
    color: Colors.grey,
    marginLeft: horizontalScale(14),
  },
});

const mapDispatchToProps = (dispatch: any) => ({
  onShowHeaderRunway: (show: any) => dispatch(onShowHeaderRunway(show)),
  onLoadMore: (data: any) => dispatch(onLoadMore(data)),
});

const mapStateToProps = (state: any) => ({
  showHeader: state.runway.showHeader,
});

export default connect(mapStateToProps, mapDispatchToProps)(RunwayScreen);
