import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import styles from './AssetManagement.scss';
import { connect } from 'react-redux';
import { fetchChildData, updateChildgridModel } from './AssetChildGrid/AssetChildGridAction';
import { fetchAssetMgmtGridData, assetMgmtGroupBy, fetchData, shareGridView, getAWCategoryList, updateAWCategory, getAssetTags, setTagsForAsset } from './AssetManagementActions';
import { getCustomViews, getGridViewWithId, saveGridView, setGridView, updateGridView, addAssetMgmtViewToFavourite, deleteAssetMgmtView, addCustomViewInState } from './AssetMgmtCustomViews/AssetMgmtCustomViewsActions';
import AgGridWrapper from '../components/AgGridWrapper/AgGridWrapper';
import '../styles/agGrid/ag-grid.scss';
import '../styles/asset_management.css';
import { AssetMgmtTableColumnDefinitionsInstance, AssetMgmtTableColumnDefinitions } from './AssetMgmtTableColumnDefinitions';
import AssetMgmtSearchFilters from './AssetMgmtSearchFilters';
import { agGridToolPanelTypes } from '../components/AgGridWrapper/AgGridToolPanels/AgGridToolPanels';
import Icon from '../components/Icon';
import { AppInsights } from 'applicationinsights-js';
import moment from 'moment';
import { assetMgmtAgGridTypes } from './agGrid/AssetMgmtTypes';
import { agGridCellRendererTypes } from '../components/AgGridWrapper/AgGridCellRenderers/AgGridCellRenderers';
import { assetMgmtComponents, assetMgmtColumns } from './agGrid/AssetMgmtComponents';
import QuickFilters from './QuickFilters';
import { SaveCustomViewModal } from '../parts-shortages/modals/SaveCustomViewModal';
import { SaveInProgressModal } from '../parts-shortages/modals/SaveInProgressModal';
import ToastLayout from '../components/Toast/ToastLayout';
import ToastErrorDetailsModal from '../components/Toast/ToastErrorDetails/ToastErrorDetailsModal';
import { useHistory, useLocation } from 'react-router-dom';
import { createToastInCollection, saveWip2SelectedRowIndex, saveFromTab } from '../actions';
import { use, view } from 'react-dom-factories';
import AssetMaximizeView from './AssetMaximizeView/AssetMaximizeViewContainer';
import { AssetMaximizeViewAction } from './AssetMaximizeView/AssetMaximizeView-actions';
import { bindActionCreators } from 'redux';
import AssetOpenTasksChart from './AssetOpenTasksChart/AssetOpenTasksChart';
import { AssetMgmtMultiselectDropdown } from './AssetMgmtMultiselectDropdown';
import { AssetSearchMultiselectDropdownV2 } from './AssetDropdown/AssetSearchMultiselectDropdownV2';
import CustomRenderer from './agGrid/CustomRenderer';
import AssetMgmtExpandAllHeaderComponent from './agGrid/AssetMgmtExpandAllHeaderComponent';
import { AssetMgmtWipByAge } from './AssetMgmtWipByAge/AssetMgmtWipByAge';
import LastUpdatedIndicator from '../table-navbar/LastUpdatedIndicator';
import OrderExchangeAvailable from './OrderExchangeAvailable/OrderExchangeAvailable';
import constants from '../constants';
import ORPChildGrid from '../work-in-progress/WipChildAgGrid/ORPChildGrid';
import LocalStorage from '../utilities/localStorage-polyfill';
import AssetChildGrid from './AssetChildGrid/AssetChildGrid';
import SendViewModal from '../parts-shortages/modals/SendViewModal';
import { UsersActions } from '../users/usersActions';
import ActionsButton from './ActionsButton';
import ArrowRight from '../resources/svgs/UTCRotorDesignSystems_v0.3.0/Arrow/Right.svg';
import ArrowLeft from '../resources/svgs/UTCRotorDesignSystems_v0.3.0/Arrow/Left.svg';
import Dropdown from './Dropdown';
import WarehouseChart from './WarehouseChart';
import CustomerVsOrders from './CustomerVsOrders';
import PanelConfig from '../../src/resources/svgs/UTCRotorDesignSystems_v0.3.0/Panel-config.svg';
import FilterIcon from '../../src/resources/svgs/UTCRotorDesignSystems_v0.3.0/Icon.svg';
import AssetPanelConfig from './AssetPanelConfigTooltip/AssetPanelConfig';
import TaskChildGrid from '../work-in-progress/WipChildAgGrid/WipChildAgGrid'
import { getPlantConfig } from '../operations/OperationsActions';
import PriorityChart from './PriorityChart';
import ESDChart from './ESDChart';

const AssetManagementView = props => {
  const [facilities, setFacilities] = useState([]);
  const [shipTo, setShipTo] = useState([]);
  const [salesOffices, setSalesOffice] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [isHutas, setHutas] = useState(true);
  const [tiers, setTiers] = useState([
    {
      id: 'Tier 1',
      name: 'Tier 1',
      filterText: 'Tier 1',
      key: 'tier',
      checked: false,
    },
    {
      id: 'Tier 2',
      name: 'Tier 2',
      filterText: 'Tier 2',
      key: 'tier',
      checked: false,
    },
    {
      id: 'Tier 3',
      name: 'Tier 3',
      filterText: 'Tier 3',
      key: 'tier',
      checked: false,
    },
  ]);
  const [topFilters, setTopFilters] = useState({ facilities: [], shipTo: [], vendors: [], salesOffices: [], tiers: tiers, tasks: [] });
  const [agGridApis, setAgGridApis] = useState({ gridApi: null, columnApi: null });
  const [selectedRows, setSelectedRows] = useState([]);
  const [zmroPoCount, setZmroPoCount] = useState(0);
  const [showSaveCustomViewModal, setShowSaveCustomViewModal] = useState(false);
  const [confirmOverwriteSaveCustomView, setConfirmOverwriteSaveCustomView] = useState(false);
  const [showSaveViewInProgress, setShowSaveViewInProgress] = useState(false);
  const [listenForDirtyState, setListenForDirtyState] = useState(false);
  const [viewStateDirty, setViewStateDirty] = useState(false);
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [overrideMaximizeCustomWidth, setOverrideMaximizeCustomWidth] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [filterChanged, setFilterChanged] = useState(false);
  const [chartSelectedData, setChartSelectedData] = useState([]);
  const [chartRowData, setChartRowData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedRange, setSelectedRange] = useState(null);
  const [datesWipByAge, setDatesWipByAge] = useState(['']);
  const [wipByAgeInDays, setWipByAgeInDays] = useState([]);
  const [wipByAgeCountZeroToThirty, setWipByAgeCountZeroToThirty] = useState(0);
  const [wipByAgeCountThirtyoneToNinety, setWipByAgeCountThirtyoneToNinety] = useState(0);
  const [wipByAgeCountNinetyAndAbove, setWipByAgeCountNinetyAndAbove] = useState(0);
  const [machedIndices, setMachedIndices] = useState([]);
  const [wipUnqueuedCount, setWipUnqueuedCount] = useState(0);
  const [snoOpenCount, setSnoOpenCount] = useState(0);
  const [suppRcvdDateMissingCount, setsuppRcvdDateMissingCount] = useState(0);
  const [tecoPoCount, setTecoPoCount] = useState(0);
  const [suppDueNextCount, setSuppDueNextCount] = useState(0);
  const [suppDueCount, setSuppDueCount] = useState(0);
  const [costDesgMisCount, setCostDesgMisCount] = useState(0);
  const [lateOrderMissingCount, setLateOrderMissingCount] = useState(0);
  const [childGridInfo, setchildGridInfo] = useState([]);
  const [showSendViewModal, setShowSendViewModal] = useState(false);
  const [toggleChartData, setToggleChartData] = useState([]);
  const [isPasteComments, setPastComments] = useState(false);
  const [selectOption, setSelectOption] = useState('None');
  const [clickPieChart, setClickPieChart] = useState(true);
  // const [isupdateChartData, setIsupdateChartData] = useState(false)
  const [extractData, setExtractData] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(false); // Initially collapsed
  const [selectedCategoryData, setSelectedCategoryData] = useState([]);
  const [applyZmroFilter, setApplyZmroFilter] = useState([]);
  const [isZmroFilterApplied, setIsZmroFilterApplied] = useState(false);
  const [isSuppFilterApplied, setIsSuppFilterApplied] = useState(false);
  const [applySuppFilter, setApplySuppFilter] = useState([]);
  const [isTecoFilterApplied, setIsTecoFilterApplied] = useState(false);
  const [applyTecoFilter, setApplyTecoFilter] = useState([]);
  const [isSuppDueFilterApplied, setIsSuppDueFilterApplied] = useState(false);
  const [applySuppDueFilter, setApplySuppDueFilter] = useState([]);
  const [isSuppOverDueFilterApplied, setIsSuppOverDueFilterApplied] = useState(false);
  const [applySuppOverDueFilter, setApplySuppOverDueFilter] = useState([]);
  const [isCdMisFilterApplied, setIsCdMisFilterApplied] = useState(false);
  const [applyCdMisFilter, setApplyCdMisFilter] = useState([]);
  const [isWipFilterApplied, setIsWipFilterApplied] = useState(false);
  const [applyWipFilter, setApplyWipFilter] = useState([]);
  const [isTecoSnoFilterApplied, setIsTecoSnoFilterApplied] = useState(false);
  const [isLateOrderFilterApplied, setIsLateOrderFilterApplied] = useState(false);
  const [applyTecoSnoFilter, setApplyTecoSnoFilter] = useState([]);
  const [selectedCount, setSelectedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [gateData, setGateData] = useState(false);
  const [toggle, setToggle] = useState(true);
  const [isChart1Checked, setIsChart1Checked] = useState(true);
  const [isChart2Checked, setIsChart2Checked] = useState(true);
  const [isGate1Checked, setIsGate1Checked] = useState(true);
  const [isGate2Checked, setIsGate2Checked] = useState(true);
  const [isGate3Checked, setIsGate3Checked] = useState(true);
  const [isSummaryChecked, setIsSummaryChecked] = useState(true);
  const [warehouseMgmtGridData, setwarehouseMgmtGridData] = useState(null);
  const maxSelection = 25;

  const history = useHistory();
  const location = useLocation();

  // const assetMgmtGridRef = useRef();
  const topFiltersRef = useRef(topFilters);
  const selectedCategoryRef = useRef(selectedCategory);
  const selectedRangeRef = useRef(selectedRange);
  const gridApiRef = useRef(null);
  const toggleChartDataRef = useRef(toggleChartData);
  const pasteProgress = useRef(false);
  const changesToRows = useRef([]);
  const chartDataRef = useRef(chartData);
  const assetDataRef = useRef(assetMgmtGridData);

  const {
    assetData,
    assetMgmtGridData,
    fetchAssetMgmtGridData,
    fetchData,
    fetchChildData,
    userPlants,
    assetMgmtGroupBy,
    isFetchingAssetMgmt,
    vendorSelected,
    customerNameSelected,
    shipToSelected,
    noneSelected,
    shareGridView,
    getAWCategoryList,
    userData,
    isPerformingViewOperation,
    getCustomViews,
    assetMgmtCustomViews,
    currentAssetMgmtView,
    setGridView,
    getGridViewWithId,
    saveGridView,
    updateGridView,
    viewSaveError,
    createToastInCollection,
    addAssetMgmtViewToFavourite,
    deleteAssetMgmtView,
    addCustomViewInState,
    isSavingFavView,
    viewRetrievalError,
    getAssetTags,
    tags,
    agedWipCategoryList
  } = props;
  console.log("assetMgmtGridData >> ", assetMgmtGridData);
  const excelStyles = [
    { id: 'dateTime', dataType: 'dateTime', numberFormat: { format: 'd MMM yy' } },
    { id: 'currencyFormat', numberFormat: { format: '#,##0.00' } },
    { id: 'non-edit-dateTime', dataType: 'dateTime', numberFormat: { format: 'd MMM yy' } },
    { id: 'textFormat', dataType: 'string' },
  ];

  //Code before adding AppInsight trackevent
  // const toggleCollapse = () => {
  //   setIsCollapsed(prevState => !prevState); // Toggle state
  //   AppInsights.trackEvent('Toggle Collapse', { isCollapsed: newState });
  // };

  const toggleCollapse = () => {
    setIsCollapsed(prevState => {
      const newState = !prevState; // Calculate new state
      AppInsights.trackEvent('View Options Toggle Collapse'); // Track event
      return newState; // Return the new state
    });
  };

  useEffect(() => {
    if (noneSelected === true) {
      assetMgmtGroupBy('noneSelected');
      setSelectOption('None');
    }
  }, [noneSelected]);

  function dirtyViewState(event) {
    if (!listenForDirtyState) {
      return;
    }

    const { type } = event;

    if (type === 'filterChanged') {
      if (window.resetQualtricsVars && window.qualtricsInit) {
        // window.resetQualtricsVars();
        window.isAssetMgmtUseFilter = true;
        // window.qualtricsInit();
      }
    }

    if ((type === 'columnMoved' && event.toIndex) || type === 'columnResized' || type === 'filterChanged') {
      setViewStateDirty(true);
    }

    if (type === 'sortChanged') {
      const newModel = event.api.getSortModel();
      let currentModel = {};
      if (currentAssetMgmtView) {
        currentModel = JSON.parse(currentAssetMgmtView.viewJSON).sorting;
      }
      let sortIsDifferent = true;
      if (newModel && newModel.length === currentModel.length) {
        sortIsDifferent = false;
        newModel.forEach((newItem, index) => {
          const oldItem = currentModel[index];
          sortIsDifferent = sortIsDifferent || oldItem.colId !== newItem.colId || oldItem.sort !== newItem.sort;
        });
      }

      if (sortIsDifferent) {
        setViewStateDirty(true);
      }
    }
  }

  function applyCurrentView() {
    if (!agGridApis.gridApi) {
      return;
    }

    const { columnApi } = agGridApis;

    setViewStateDirty(false);
    setListenForDirtyState(false);
    setTimeout(() => {
      setListenForDirtyState(true);
    }, 2000);

    if (!currentAssetMgmtView) {
      agGridApis.gridApi.setColumnDefs([]);
      agGridApis.gridApi.setColumnDefs(AssetMgmtTableColumnDefinitionsInstance.columnDefinitions(props, { editAgedWipCategory, editComments, editTags, saveDataforWip2Navigation }, assetData, agGridApis));
      agGridApis.gridApi.onFilterChanged();
      return;
    }

    const desiredState = JSON.parse(currentAssetMgmtView.viewJSON);
    if (!desiredState) {
      localStorage.setItem(asset-mgmt-last-view-${userData.plant.sapPlant}, '');
      history.push(${location.pathname});
      return;
    }

    const currentColumnsState = columnApi.getColumnState().slice();
    const newColumnState = desiredState.columns.map(desiredColumn => {
      const matchingCurrentColumn = currentColumnsState.find(currentColumn => desiredColumn.colId === currentColumn.colId);
      return Object.assign({}, matchingCurrentColumn, desiredColumn);
    });
    columnApi.setColumnState(newColumnState);

    if (desiredState.topFilters) {
      const mapOn = (filters, selectedItems) => {
        if (!selectedItems) {
          return filters;
        }
        filters.forEach(it => {
          it.checked = false;
        });
        selectedItems.forEach(item => {
          const match = filters.find(it => it.name === item.name);
          if (match) {
            match.checked = item.checked;
          }
        });
        return filters;
      };

      const newTopFiltersState = {
        facilities: mapOn(topFilters.facilities, desiredState.topFilters.facilities),
        salesOffices: mapOn(topFilters.salesOffices, desiredState.topFilters.salesOffices),
        shipTo: mapOn(topFilters.shipTo, desiredState.topFilters.shipTo),
        tiers: mapOn(topFilters.tiers, desiredState.topFilters.tiers),
        vendors: mapOn(topFilters.vendors, desiredState.topFilters.vendors),
      };

      setTopFilters(newTopFiltersState);
      setFacilities(newTopFiltersState.facilities);
      setSalesOffice(newTopFiltersState.salesOffices);
      setShipTo(newTopFiltersState.shipTo);
      setVendors(newTopFiltersState.vendors);
      setTiers(newTopFiltersState.tiers);
    }
    setFilter(desiredState.gridFilters);
    setSort(desiredState.sorting);
    if (desiredState.groupBy) {
      assetMgmtGroupBy(desiredState.groupBy);
    } else {
      assetMgmtGroupBy('noneSelected');
    }

    setIsChart1Checked(desiredState.isChart1Checked !== undefined ? desiredState.isChart1Checked : isChart1Checked);
    setIsChart2Checked(desiredState.isChart2Checked !== undefined ? desiredState.isChart2Checked : isChart2Checked);
    setIsGate1Checked(desiredState.isGate1Checked !== undefined ? desiredState.isGate1Checked : isGate1Checked);
    setIsGate2Checked(desiredState.isGate2Checked !== undefined ? desiredState.isGate2Checked : isGate2Checked);
    setIsGate3Checked(desiredState.isGate3Checked !== undefined ? desiredState.isGate3Checked : isGate3Checked);
    setIsSummaryChecked(desiredState.isSummaryChecked !== undefined ? desiredState.isSummaryChecked : isSummaryChecked);
  }

  function setFilter(newFilterModel) {
    if (newFilterModel !== undefined && newFilterModel !== null) {
      agGridApis.gridApi.setFilterModel(newFilterModel);
      agGridApis.gridApi.onFilterChanged();
    }
  }

  function setSort(newSortModel) {
    if (newSortModel !== undefined && newSortModel !== null) {
      agGridApis.gridApi.setSortModel(newSortModel);
      agGridApis.gridApi.onSortChanged();
    }
  }

  function onGridReady(params) {
    // agGridApis.gridApi.current = params.api;

    setAgGridApis({ gridApi: params.api, columnApi: params.columnApi });
    gridApiRef.current = params.api;
    window.gridApi = params.api;
    // if (assetMgmtGridData && assetMgmtGridData.length === 0) {
    //   params.api.showLoadingOverlay();
    // }
    if (loading) {
      params.api.showLoadingOverlay();
    } else {
      params.api.hideOverlay();
    }
    localStorage.setItem('last-location-before-logout', '/outside-repairs');
    const lastViewId = localStorage.getItem(asset-mgmt-last-view-${userData.plant.sapPlant});
    if (lastViewId) {
      history.push(${location.pathname}?viewId=${lastViewId});
    }
    applyCurrentView();
  }

  useEffect(() => {
    AppInsights.trackPageView('Asset Management');
    if (userData && userData.appUserPlants) {
      const userPlants = userData.appUserPlants.map(aup => aup.userPlant.sapPlant);

      if (userPlants && userPlants.length > 0) {
        setLoading(true);
        fetchData(userPlants);
      }
    }
    props.getPlantConfig(userPlants)
    getCustomViews();
    getAWCategoryList();
    getAssetTags();
  }, [userData]);

  useEffect(() => {
    getCustomViews();
  }, [isSavingFavView]);

  function toggleItemSelection(updatedItems) {
    setTasks(updatedItems);

    const newSelectedItems = tasks.filter(item => item.checked);
    setSelectedItems(newSelectedItems);
    const colorsArray = ['#062C8A', '#1A4DD0', '#396FF6', '#5886F7', '#88ABF9', '#C6D6FC'];
    const selectedChartData = newSelectedItems.map((task, index) => {
      const [Category, ValueString] = task.filterText.split('(');
      let Value = parseInt(ValueString);
      if (isNaN(Value)) {
        Value = 0;
      }

      const color = colorsArray[index % colorsArray.length];

      return {
        Category: Category.trim(),
        Value: task.count,
        color, // Add the color property
      };
    });
    setChartData(selectedChartData);
    setToggleChartData(selectedChartData);
  }

  // Open tasks Chart Data Ends

  useEffect(() => {
    if (assetMgmtGridData && assetMgmtGridData.length > 0) {
      const facilities = assetMgmtGridData.map(facilities => mapFacilities(facilities, false));
      facilities.sort((a, b) => a.name.localeCompare(b.name));
      setFacilities(facilities);
      setTopFilters(topFilters => {
        return {
          ...topFilters,
          facilities: [...new Map(facilities.map(plant => [plant['name'], plant])).values()],
        };
      });
    }
  }, [assetMgmtGridData]);

  useEffect(() => {
    if (assetMgmtGridData && assetMgmtGridData.length > 0) {
      const shipTo = assetMgmtGridData.map(shipTo => mapShipTo(shipTo, false));
      shipTo.sort((a, b) => {
        const nameA = typeof a.name === 'string' ? a.name : '';
        const nameB = typeof b.name === 'string' ? b.name : '';
        return nameA.localeCompare(nameB);
      });
      setShipTo(shipTo);
      setTopFilters(topFilters => {
        return {
          ...topFilters,
          shipTo: [...new Map(shipTo.map(item => [item['name'], item])).values()],
        };
      });
    }
  }, [assetMgmtGridData]);

  useEffect(() => {
    if (assetMgmtGridData && assetMgmtGridData.length > 0) {
      const salesOffices = assetMgmtGridData.map(salesOffices => mapSalesOffice(salesOffices, false));
      salesOffices.sort((a, b) => {
        const nameA = typeof a.name === 'string' ? a.name : '';
        const nameB = typeof b.name === 'string' ? b.name : '';
        return nameA.localeCompare(nameB);
      });
      setSalesOffice(salesOffices);
      setTopFilters(topFilters => {
        return {
          ...topFilters,
          salesOffices: [...new Map(salesOffices.map(salesOffice => [salesOffice['name'], salesOffice])).values()],
        };
      });
    }
  }, [assetMgmtGridData]);

  useEffect(() => {
    if (assetMgmtGridData && assetMgmtGridData.length > 0) {
      const vendors = assetMgmtGridData.map(vendors => mapVendor(vendors, false));
      vendors.sort((a, b) => {
        const nameA = typeof a.name === 'string' ? a.name : '';
        const nameB = typeof b.name === 'string' ? b.name : '';
        return nameA.localeCompare(nameB);
      });
      setVendors(vendors);
      setTopFilters(topFilters => {
        return {
          ...topFilters,
          vendors: [...new Map(vendors.map(vendor => [vendor['name'], vendor])).values()],
        };
      });
    }
  }, [assetMgmtGridData]);

  useEffect(() => {
    setShowSaveCustomViewModal(false);
    applyCurrentView();
  }, [agGridApis, currentAssetMgmtView]);

  useEffect(() => {
    const { gridApi } = agGridApis;
    if (gridApi && gridApi.showLoadingOverlay) {
      gridApi.showLoadingOverlay();
    }
    if (location.search) {
      const viewId = new URLSearchParams(location.search).get('viewId');
      if (userData) {
        localStorage.setItem(asset-mgmt-last-view-${userData.plant.sapPlant}, viewId);
      }
      if (viewId > -1) {
        if (userData) {
          getGridViewWithId(viewId, gridApi).then(() => {
            if (gridApi !== null) {
              gridApi.hideOverlay();
            }
          });
        }
      } else {
        setGridView();
        if (gridApi && gridApi.hideOverlay) {
          gridApi.hideOverlay();
        }
      }
    } else {
      localStorage.setItem(asset-mgmt-last-view-${userData.plant.sapPlant}, 1);
      getGridViewWithId(1);
    }
  }, [history.location, userData]);

  function mapFacilities(facilities, checked) {
    return {
      id: facilities.plant,
      name: facilities.plant,
      filterText: facilities.plant,
      key: 'plant',
      checked,
    };
  }

  function mapShipTo(shipTo, checked) {
    return {
      id: shipTo.shipToName,
      name: shipTo.shipToName,
      filterText: shipTo.shipToName,
      key: 'shipToName',
      checked,
    };
  }
  function mapSalesOffice(salesOffices, checked) {
    return {
      id: salesOffices.salesOfficeDesc,
      name: salesOffices.salesOfficeDesc,
      filterText: salesOffices.salesOfficeDesc,
      key: 'salesOffice',
      checked,
    };
  }

  function mapVendor(vendors, checked) {
    return {
      id: vendors.vendor,
      name: vendors.vendor,
      filterText: vendors.vendor,
      key: 'vendor',
      checked,
    };
  }

  function mapTiers(tag, checked) {
    return {
      id: tag, // Unique identifier, using the tag itself
      name: tag, // Display name for the tier
      filterText: tag, // Text used for filtering, same as name
      key: 'tier', // Key used to identify the type of item
      checked, // Indicates if the tier is checked
    };
  }

  //Maping data for open tasks chart

  function mapTasks(uniqueValues) {
    const checkedTasks = Array.from(uniqueValues).map((task, index) => ({
      name: task,
      checked: index < 6, // Set checked to true for the first 6 unique tasks
    }));
    return checkedTasks;
  }

  useEffect(() => {
    if (assetMgmtGridData && assetMgmtGridData.length > 0 && agGridApis.gridApi) {
      const anyChecked = Object.values(topFilters).some(filterArray => filterArray.some(filterItem => filterItem.checked));
      const checkedValues = Object.values(topFilters) // Get arrays of filter items
        .flat() // Flatten the arrays into a single array of filter items
        .filter(filterItem => filterItem.checked); // Filter items where 'checked' is true

      const filteredValue = checkedValues.map(obj => ({
        name: obj.name,
        key: obj.key,
      }));

      const shipToNames = filteredValue.filter(item => item.key === 'shipToName').map(item => item.name);

      const vendorNames = filteredValue
        .filter(item => item.key === 'vendor') // Filter by key if needed
        .map(item => item.name);

      const plants = filteredValue.filter(item => item.key === 'plant').map(item => item.name);

      const salesOffices = filteredValue.filter(item => item.key === 'salesOffice').map(item => item.name);

      const gridData = [];

      agGridApis.gridApi.forEachNodeAfterFilter(rowNode => {
        gridData.push(rowNode.data);
      });

      const dataToUseForFilter = anyChecked ? gridData : assetMgmtGridData;

      const filteredArrayOfKeys = dataToUseForFilter.filter(item => {
        if (!item) return false;
        return (
          (salesOffices.length === 0 || salesOffices.includes(item.salesOffice)) &&
          (vendorNames.length === 0 || vendorNames.includes(item.vendor)) &&
          (plants.length === 0 || plants.includes(item.plant)) &&
          (shipToNames.length === 0 || shipToNames.includes(item.shipToName))
        );
      });

      // const filteredData = [];

      // agGridApis.gridApi.forEachNodeAfterFilter(rowNode => {
      //   filteredData.push(rowNode.data);
      // });

      // const gridData = agGridApis.gridApi.forEachNodeAfterFilter(rowNode => rowNode.data)

      const dataSource = anyChecked ? filteredArrayOfKeys : assetMgmtGridData;

      // let dataSource;

      // if (anyChecked) {
      //   dataSource = filteredArrayOfKeys;
      // } else if (anyChecked && filteredArrayOfKeys) {
      //   datasource = gridData
      // } else {
      //   dataSource = assetMgmtGridData;
      // }

      const tasksMapped = dataSource
        .map(task => {
          if (task && task.mmlOpenTasks && Array.isArray(task.mmlOpenTasks) && task.mmlOpenTasks.length > 0) {
            // Split the tasks string into individual tasks
            const individualTasks = task.mmlOpenTasks[0].split(';');

            return individualTasks
              .map(individualTask => {
                const match = individualTask.match(/(\w+)\((\d+)\)/);
                if (match) {
                  const taskId = match[1];
                  return {
                    id: taskId,
                    name: taskId,
                    filterText: individualTask,
                    checked: false, // Find corresponding checked value
                    value: parseInt(match[2], 10),
                  };
                }
                return null;
              })
              .filter(mappedTask => mappedTask !== null);
          } else {
            // Handle the case where task or task.mmlOpenTasks is undefined or not an array
            return null; // Or handle it according to your application logic
          }
        })
        .flat() // Flatten the array of arrays into a single array
        .filter(mappedTask => mappedTask !== null);

      const uniqueTaskIds = new Set();
      tasksMapped.forEach(task => {
        if (uniqueTaskIds.size < 6 && !uniqueTaskIds.has(task.id)) {
          task.checked = true;
          uniqueTaskIds.add(task.id);
        }
      });

      const mergedTasks = tasksMapped.reduce((acc, task) => {
        if (!acc[task.id]) {
          acc[task.id] = {
            id: task.id,
            name: task.name,
            filterText: task.filterText,
            checked: task.checked,
            values: [task.value],
            count: 1,
          };
        } else {
          acc[task.id].values.push(task.value);
          acc[task.id].count += 1;
        }
        return acc;
      }, {});

      const mergedTasksArray = Object.values(mergedTasks);

      setTasks(mergedTasksArray);

      //Chart Data
      const selectedItems = mergedTasksArray.filter(task => task.checked === true);
      const extractedData = selectedItems.map(task => {
        const [Category, ValueString] = task.filterText.split('(');
        let Value = parseInt(ValueString);
        if (isNaN(Value)) {
          Value = 0;
        }
        return { Category: Category.trim(), Value: task.count };
      });

      // const selectedCatg = [extractedData.find(item => item.Category === selectedCategoryData.Category)];
      const selectedCatg = selectedCategoryData ? [extractedData.find(item => item.Category === selectedCategoryData.Category)] : [];
      const dataSelectedCatg = anyChecked && !!selectedCatg[0] ? selectedCatg : extractedData;
      const colorsArray = ['#062C8A', '#1A4DD0', '#396FF6', '#5886F7', '#88ABF9', '#C6D6FC'];
      const updatedDataArray = dataSelectedCatg.map((item, index) => ({
        ...item,
        color: colorsArray[index % colorsArray.length], // Use modulo to loop over colors if needed
      }));
      const strokeWidth = 2;
      let datacolor = updatedDataArray.map(x => {
        return x.Category === selectedCategoryData.Category ? { ...x, color: '#23cabd', strokeColor: '#16782e', strokeWidth, fill: 'none' } : x;
      });
      let toggleChartDataColor = toggleChartData.map(x => {
        return x.Category === selectedCategoryData.Category ? { ...x, color: '#23cabd', strokeColor: '#16782e', strokeWidth, fill: 'none' } : x;
      });
      const chartSelectedData = toggleChartData.length > 0 && !anyChecked ? toggleChartDataColor : datacolor;
      console.log("chartSelectedData", chartSelectedData);

      setChartData(chartSelectedData);
      // setChartData(extractedData);
      setExtractData(extractedData);
    }
  }, [assetMgmtGridData, filterChanged, topFilters]);

  useEffect(() => {
    if (agGridApis.gridApi) {
      const onFilterChanged = () => {
        setFilterChanged(prev => !prev); // Toggle state to trigger useEffect
      };

      agGridApis.gridApi.addEventListener('filterChanged', onFilterChanged);

      // Cleanup event listener on component unmount
      return () => {
        agGridApis.gridApi.removeEventListener('filterChanged', onFilterChanged);
      };
    }
  }, [agGridApis.gridApi]);

  function onTopLevelFiltersChanged(field, results) {
    AppInsights.trackEvent('Left Panel Filters');
    const modified = {};
    modified[field] = results;
    setTopFilters(Object.assign({}, topFilters, modified));
  }

  useEffect(() => {
    topFiltersRef.current = topFilters;
    if (agGridApis.gridApi) {
      agGridApis.gridApi.onFilterChanged();
    }
  }, [topFilters, viewRetrievalError]);

  function areTopLevelFiltersActive() {
    const { facilities, shipTo, vendors, salesOffices, tiers } = topFiltersRef.current;
    return facilities.some(it => it.checked) || shipTo.some(it => it.checked) || vendors.some(it => it.checked) || salesOffices.some(it => it.checked) || tiers.some(it => it.checked);
  }

  function doTopLevelFiltersPass(node) {
    const { facilities, shipTo, vendors, salesOffices, tiers } = topFiltersRef.current;
    const { plant, shipToName, vendor, salesOfficeDesc, tags } = node.data;

    const passes = (group, field) => {
      let pass = true;
      if (group.some(it => it.checked)) {
        if (typeof field === 'object' && Array.isArray(field.tagsList)) {
          pass = group.some(it => it.checked && field.tagsList.includes(it.name));
        } else if (Array.isArray(field)) {
          pass = group.some(it => it.checked && field.includes(it.name));
        } else {
          pass = group.some(it => it.checked && String(it.name) === String(field));
        }
      }
      return pass;
    };
    return passes(facilities, plant) && passes(shipTo, shipToName) && passes(vendors, vendor) && passes(salesOffices, salesOfficeDesc) && passes(tiers, tags);
  }

  function exportData() {
    const currentViewName = currentAssetMgmtView ? currentAssetMgmtView.name : 'All Orders';
    AppInsights.trackEvent('Asset Management Export');

    return agGridApis.gridApi.exportDataAsExcel({
      columnKeys: generateColumnsForExcel(),
      fileName: currentViewName + '_' + new moment().format('DD_MMM_YYYY_hh:mm:ss'),
      processCellCallback: cell => {
        if (cell.column.colDef.field === 'notifNo') {
          if (cell.node.data.notifNo) {
            // cell.node.data.notifNo = ${cell.node.data.notifNo}; // Add an apostrophe to force Excel to interpret as text
            cell.node.data.notifNo = cell.node.data.notifNo + String.fromCharCode(8203);
          }
          return ${cell.node.data.notifNo};
        }

        if (cell.column.colDef.field === 'salesOfficeDesc') {
          const salesOffice = assetMgmtGridData.find(row => row.salesOffice === cell.value);
          const salesOfficeId = salesOffice ? salesOffice.salesOffice || '' : '';
          const salesOfficeName = salesOffice ? salesOffice.salesOfficeDesc || '' : '';
          let result = '';
          if (salesOfficeId) result += salesOfficeId;
          if (salesOfficeName) {
            if (result) result += ' \n '; // Add newline if there's already some content
            result += salesOfficeName;
          }

          return result;
        }

        if (cell.column.colDef.field === 'costDesig') {
          const { poCostDesignator, soNetValue, woCostDesignator } = cell.value;
          return ${poCostDesignator} \n ${soNetValue} \n ${woCostDesignator};
        }

        if (cell.column.colDef.field === 'customer') {
          if (cell.node.data.custName) {
            return cell.node.data.customer.custName;
          }
        }

        if (cell.column.colDef.field === 'customerIdSoldTo') {
          if (cell.node.data.customerIdSoldTo) {
            return cell.node.data.customer.customerIdSoldTo;
          }
        }
        return cell.column.colDef.exportTransform != null ? cell.column.colDef.exportTransform(cell) : cell.value;
      },
    });
  }

  function generateColumnsForExcel() {
    const { columnApi } = agGridApis;
    const keys = columnApi.getAllDisplayedColumns().map(column => column.getColId());

    let index = keys.findIndex(column => column === 'netValue');
    if (index >= 0) {
      keys.splice(index + 1, 0, 'soCurrency');
    }
    let partsColumnIndex = keys.findIndex(column => column === 'PartInfo');
    if (partsColumnIndex >= 0) {
      keys.splice(partsColumnIndex, 1);
      keys.splice(partsColumnIndex + 1, 0, 'matlDescr');
      keys.splice(partsColumnIndex + 2, 0, 'mfrPartNumber');
    }
    let vendorColumnIndex = keys.findIndex(column => column === 'highestORPRiskInfo');
    if (vendorColumnIndex >= 0) {
      keys.splice(vendorColumnIndex, 1);
      keys.splice(vendorColumnIndex + 1, 0, 'highestORPRiskInfo');
      keys.splice(vendorColumnIndex + 2, 0, 'vendor');
      keys.splice(vendorColumnIndex + 3, 0, 'purchaseOrderNumber');
    }

    let priorityColumnIndex = keys.findIndex(column => column === 'finalPriorityScore');
    if (priorityColumnIndex >= 0) {
      keys.splice(priorityColumnIndex, 1);
      keys.splice(priorityColumnIndex + 1, 0, 'priorityScore');
      keys.splice(priorityColumnIndex + 2, 0, 'daysUntillDue');
      keys.splice(priorityColumnIndex + 3, 0, 'unitType');
    }

    let customerColumnIndex = keys.findIndex(column => column === 'customer');
    if (customerColumnIndex >= 0) {
      keys.splice(customerColumnIndex, 1);
      keys.splice(customerColumnIndex, 0, 'customerIdSoldTo');
      keys.splice(customerColumnIndex + 1, 0, 'custName');
    }
    let jobCategoryIndex = keys.findIndex(column => column === 'categDescr');
    if (jobCategoryIndex >= 0) {
      keys.splice(jobCategoryIndex + 1, 0, 'category');
    }
    return keys;
  }

  useEffect(() => {
    if (assetMgmtGridData && assetMgmtGridData.length > 0 && agGridApis.gridApi) {
      const visibleRows = agGridApis.gridApi.getModel().rowsToDisplay.filter(it => it.parent && it.parent.allLeafChildren);

      const anyChecked = Object.values(topFilters).some(filterArray => filterArray.some(filterItem => filterItem.checked));

      const dataSource = anyChecked ? visibleRows : assetMgmtGridData;
      const currentDate = new Date();
      if (dataSource === visibleRows) {
        //Gate 1 Order Generation
        setZmroPoCount(visibleRows.filter(it => it.data && it.data.zmro === '' && it.data.gateNo === '1').length);

        //Gate 2 Core Management
        setsuppRcvdDateMissingCount(visibleRows.filter(it => it.data && it.data.supplierReceiveDate === '' && it.data.gateNo === '2').length);
        setTecoPoCount(visibleRows.filter(it => it.data && it.data.tecoPoOpen === true && it.data.gateNo === '2').length);
        setSuppDueNextCount(visibleRows.filter(it => it.data && it.data.suppDueNext7Days === true && it.data.gateNo === '2').length);
        setSuppDueCount(visibleRows.filter(it => it.data && it.data.suppOverdue === true && it.data.gateNo === '2').length);
        setCostDesgMisCount(visibleRows.filter(it => it.data && it.data.cdMismatch === true && it.data.gateNo === '2').length);
        setLateOrderMissingCount(
          assetMgmtGridData.filter(it =>
            it.data &&
            it.data.cslDate &&
            // Parse 'cslDate' in "06 Apr 2020" format to a Moment object and compare it to currentDate
            moment(it.data.cslDate, "DD MMM YYYY").isBefore(currentDate) &&
            // Check if 'replShipDate' is null or empty string
            (!it.data.replShipDate || it.data.replShipDate === '') &&
            it.data.gateNo === '2'
          ).length
        );
        //Gate 3 Order Closure
        setWipUnqueuedCount(visibleRows.filter(it => it.data && it.data.wipUnqueued === true && it.data.gateNo === '3').length);
        setSnoOpenCount(visibleRows.filter(it => it.data && it.data.tecoSnoOpen === true && it.data.gateNo === '3').length);
        if (isZmroFilterApplied) {
          const filteredGate1data = visibleRows.filter(it => it.data && it.data.zmro === '' && it.data.gateNo === '1');
          setGateData(filteredGate1data);
        } else if (isSuppFilterApplied) {
          const filteredGate2SuppData = visibleRows.filter(it => it.data && it.data.supplierReceiveDate === '' && it.data.gateNo === '2');
          setGateData(filteredGate2SuppData);
        } else if (isTecoFilterApplied) {
          const filteredGate2TecoData = visibleRows.filter(it => it.data && it.data.tecoPoOpen === true && it.data.gateNo === '2');
          setGateData(filteredGate2TecoData);
        } else if (isSuppDueFilterApplied) {
          const filteredGate2SuppDueData = visibleRows.filter(it => it.data && it.data.tecoPoOpen === true && it.data.gateNo === '2');
          setGateData(filteredGate2SuppDueData);
        } else if (isSuppOverDueFilterApplied) {
          const filteredGate2SuppOverDueData = visibleRows.filter(it => it.data && it.data.suppOverdue === true && it.data.gateNo === '2');
          setGateData(filteredGate2SuppOverDueData);
        } else if (isCdMisFilterApplied) {
          const filteredGate2CdMisData = visibleRows.filter(it => it.data && it.data.cdMismatch === true && it.data.gateNo === '2');
          setGateData(filteredGate2CdMisData);
        } else if (isLateOrderFilterApplied) {
          const filteredGate2LateOrderData = visibleRows.filter(it => it.data &&
            it.data.cslDate &&
            // Parse 'cslDate' in "06 Apr 2020" format to a Moment object and compare it to currentDate
            moment(it.data.cslDate, "DD MMM YYYY").isBefore(currentDate) &&
            // Check if 'replShipDate' is null or empty string
            (!it.data.replShipDate || it.data.replShipDate === '') &&
            it.data.gateNo === '2');
          setGateData(filteredGate2LateOrderData);
        } else if (isWipFilterApplied) {
          const filteredGate3WipData = visibleRows.filter(it => it.data && it.data.wipUnqueued === true && it.data.gateNo === '3');
          setGateData(filteredGate3WipData);
        } else if (isTecoSnoFilterApplied) {
          const filteredGate3TecoSnoData = visibleRows.filter(it => it.data && it.data.tecoSnoOpen === true && it.data.gateNo === '3');
          setGateData(filteredGate3TecoSnoData);
        } else {
          setGateData(false);
        }
      } else {
        setZmroPoCount(assetMgmtGridData.filter(it => it && it.zmro === '' && it.gateNo === '1').length);

        //Gate 2 Core Management
        setsuppRcvdDateMissingCount(assetMgmtGridData.filter(it => it && it.supplierReceiveDate === '' && it.gateNo === '2').length);
        setTecoPoCount(assetMgmtGridData.filter(it => it && it.tecoPoOpen === true && it.gateNo === '2').length);
        setSuppDueNextCount(assetMgmtGridData.filter(it => it && it.suppDueNext7Days === true && it.gateNo === '2').length);
        setSuppDueCount(assetMgmtGridData.filter(it => it && it.suppOverdue === true && it.gateNo === '2').length);
        setCostDesgMisCount(assetMgmtGridData.filter(it => it && it.cdMismatch === true && it.gateNo === '2').length);
        setLateOrderMissingCount(
          assetMgmtGridData.filter(it =>
            it &&
            it.cslDate &&
            // Parse 'cslDate' in "06 Apr 2020" format to a Moment object and compare it to currentDate
            moment(it.cslDate, "DD MMM YYYY").isBefore(currentDate) &&
            // Check if 'replShipDate' is null or empty string
            (!it.replShipDate || it.replShipDate === '') &&
            it.gateNo === '2'
          ).length
        );
        //Gate 3 Oredr Closure
        setWipUnqueuedCount(assetMgmtGridData.filter(it => it && it.wipUnqueued === true && it.gateNo === '3').length);
        setSnoOpenCount(assetMgmtGridData.filter(it => it && it.tecoSnoOpen === true && it.gateNo === '3').length);
        if (isZmroFilterApplied) {
          const filteredGate1data = assetMgmtGridData.filter(it => it && it.zmro === '' && it.gateNo === '1');
          setGateData(filteredGate1data);
        } else if (isSuppFilterApplied) {
          const filteredGate2SuppData = assetMgmtGridData.filter(it => it && it.supplierReceiveDate === '' && it.gateNo === '2');
          setGateData(filteredGate2SuppData);
        } else if (isTecoFilterApplied) {
          const filteredGate2TecoData = assetMgmtGridData.filter(it => it && it.tecoPoOpen === true && it.gateNo === '2');
          setGateData(filteredGate2TecoData);
        } else if (isSuppDueFilterApplied) {
          const filteredGate2SuppDueData = assetMgmtGridData.filter(it => it && it.suppDueNext7Days === true && it.gateNo === '2');
          setGateData(filteredGate2SuppDueData);
        } else if (isSuppOverDueFilterApplied) {
          const filteredGate2SuppOverDueData = assetMgmtGridData.filter(it => it && it.suppOverdue === true && it.gateNo === '2');
          setGateData(filteredGate2SuppOverDueData);
        } else if (isCdMisFilterApplied) {
          const filteredGate2CdMisData = assetMgmtGridData.filter(it => it && it.cdMismatch === true && it.gateNo === '2');
          setGateData(filteredGate2CdMisData);
        } else if (isLateOrderFilterApplied) {
          const filteredGate2LateOrderData = assetMgmtGridData.filter(it => it &&
            it.cslDate &&
            // Parse 'cslDate' in "06 Apr 2020" format to a Moment object and compare it to currentDate
            moment(it.cslDate, "DD MMM YYYY").isBefore(currentDate) &&
            // Check if 'replShipDate' is null or empty string
            (!it.replShipDate || it.replShipDate === '') &&
            it.gateNo === '2');
          setGateData(filteredGate2LateOrderData);
        } else if (isWipFilterApplied) {
          const filteredGate3WipData = assetMgmtGridData.filter(it => it && it.wipUnqueued === true && it.gateNo === '3');
          setGateData(filteredGate3WipData);
        } else if (isTecoSnoFilterApplied) {
          const filteredGate3TecoSnoData = assetMgmtGridData.filter(it => it && it.tecoSnoOpen === true && it.gateNo === '3');
          setGateData(filteredGate3TecoSnoData);
        } else {
          setGateData(false);
        }
      }
    }
  }, [
    assetMgmtGridData,
    topFilters,
    filterChanged,
    isZmroFilterApplied,
    isSuppFilterApplied,
    isTecoFilterApplied,
    isSuppDueFilterApplied,
    isSuppOverDueFilterApplied,
    isCdMisFilterApplied,
    isWipFilterApplied,
    isTecoSnoFilterApplied,
    isLateOrderFilterApplied
  ]);

  const handleFilterClick = (filterSetter, ...otherSetters) => {
    filterSetter(prev => {
      const newValue = !prev;
      if (newValue) {
        otherSetters.forEach(setter => setter(false));
      }
      return newValue;
    });
  };

  const handleZmroClick = () => {
    AppInsights.trackEvent('No ZMRO FilterClick');
    handleFilterClick(
      setIsZmroFilterApplied,
      setIsSuppFilterApplied,
      setIsTecoFilterApplied,
      setIsSuppDueFilterApplied,
      setIsSuppOverDueFilterApplied,
      setIsCdMisFilterApplied,
      setIsWipFilterApplied,
      setIsTecoSnoFilterApplied,
      setIsLateOrderFilterApplied
    );
  };

  const handleSuppClick = () => {
    AppInsights.trackEvent('Supp FilterClick');
    handleFilterClick(
      setIsSuppFilterApplied,
      setIsZmroFilterApplied,
      setIsTecoFilterApplied,
      setIsSuppDueFilterApplied,
      setIsSuppOverDueFilterApplied,
      setIsCdMisFilterApplied,
      setIsWipFilterApplied,
      setIsTecoSnoFilterApplied,
      setIsLateOrderFilterApplied
    );
  };

  const handleTecoClick = () => {
    AppInsights.trackEvent('Teco FilterClick');
    handleFilterClick(
      setIsTecoFilterApplied,
      setIsZmroFilterApplied,
      setIsSuppFilterApplied,
      setIsSuppDueFilterApplied,
      setIsSuppOverDueFilterApplied,
      setIsCdMisFilterApplied,
      setIsWipFilterApplied,
      setIsTecoSnoFilterApplied,
      setIsLateOrderFilterApplied
    );
  };

  const handleSuppDueClick = () => {
    AppInsights.trackEvent('SuppDue FilterClick');
    handleFilterClick(
      setIsSuppDueFilterApplied,
      setIsZmroFilterApplied,
      setIsSuppFilterApplied,
      setIsTecoFilterApplied,
      setIsSuppOverDueFilterApplied,
      setIsCdMisFilterApplied,
      setIsWipFilterApplied,
      setIsTecoSnoFilterApplied,
      setIsLateOrderFilterApplied
    );
  };

  const handleSuppOverDueClick = () => {
    AppInsights.trackEvent('SuppOverdueFilterClick');
    handleFilterClick(
      setIsSuppOverDueFilterApplied,
      setIsZmroFilterApplied,
      setIsSuppFilterApplied,
      setIsTecoFilterApplied,
      setIsSuppDueFilterApplied,
      setIsCdMisFilterApplied,
      setIsWipFilterApplied,
      setIsTecoSnoFilterApplied,
      setIsLateOrderFilterApplied
    );
  };

  const handleCdMisClick = () => {
    AppInsights.trackEvent('cdMis FilterClick');
    handleFilterClick(
      setIsCdMisFilterApplied,
      setIsZmroFilterApplied,
      setIsSuppFilterApplied,
      setIsTecoFilterApplied,
      setIsSuppDueFilterApplied,
      setIsSuppOverDueFilterApplied,
      setIsWipFilterApplied,
      setIsTecoSnoFilterApplied,
      setIsLateOrderFilterApplied
    );
  };

  const handleLateOrderClick = () => {
    AppInsights.trackEvent('Late Order FilterClick');
    handleFilterClick(
      setIsLateOrderFilterApplied,
      setIsCdMisFilterApplied,
      setIsZmroFilterApplied,
      setIsSuppFilterApplied,
      setIsTecoFilterApplied,
      setIsSuppDueFilterApplied,
      setIsSuppOverDueFilterApplied,
      setIsWipFilterApplied,
      setIsTecoSnoFilterApplied,
    );
  };

  const handleWipClick = () => {
    AppInsights.trackEvent('WipUnque FilterClick');
    handleFilterClick(
      setIsWipFilterApplied,
      setIsZmroFilterApplied,
      setIsSuppFilterApplied,
      setIsTecoFilterApplied,
      setIsSuppDueFilterApplied,
      setIsSuppOverDueFilterApplied,
      setIsCdMisFilterApplied,
      setIsTecoSnoFilterApplied,
      setIsLateOrderFilterApplied
    );
  };

  const handleTecoSnoClick = () => {
    AppInsights.trackEvent('TecoSno FilterClick');
    handleFilterClick(
      setIsTecoSnoFilterApplied,
      setIsZmroFilterApplied,
      setIsSuppFilterApplied,
      setIsTecoFilterApplied,
      setIsSuppDueFilterApplied,
      setIsSuppOverDueFilterApplied,
      setIsCdMisFilterApplied,
      setIsWipFilterApplied,
      setIsLateOrderFilterApplied
    );
  };
  //Before adding AppInsights
  // const handleZmroClick = () => handleFilterClick(setIsZmroFilterApplied, setIsSuppFilterApplied, setIsTecoFilterApplied, setIsSuppDueFilterApplied, setIsSuppOverDueFilterApplied, setIsCdMisFilterApplied, setIsWipFilterApplied, setIsTecoSnoFilterApplied);
  // const handleSuppClick = () => handleFilterClick(setIsSuppFilterApplied, setIsZmroFilterApplied, setIsTecoFilterApplied, setIsSuppDueFilterApplied, setIsSuppOverDueFilterApplied, setIsCdMisFilterApplied, setIsWipFilterApplied, setIsTecoSnoFilterApplied);
  //   const handleTecoClick = () => handleFilterClick(setIsTecoFilterApplied, setIsZmroFilterApplied, setIsSuppFilterApplied, setIsSuppDueFilterApplied, setIsSuppOverDueFilterApplied, setIsCdMisFilterApplied, setIsWipFilterApplied, setIsTecoSnoFilterApplied);
  //   const handleSuppDueClick = () => handleFilterClick(setIsSuppDueFilterApplied, setIsZmroFilterApplied, setIsSuppFilterApplied, setIsTecoFilterApplied, setIsSuppOverDueFilterApplied, setIsCdMisFilterApplied, setIsWipFilterApplied, setIsTecoSnoFilterApplied);
  //   const handleSuppOverDueClick = () => handleFilterClick(setIsSuppOverDueFilterApplied, setIsZmroFilterApplied, setIsSuppFilterApplied, setIsTecoFilterApplied, setIsSuppDueFilterApplied, setIsCdMisFilterApplied, setIsWipFilterApplied, setIsTecoSnoFilterApplied);
  //   const handleCdMisClick = () => handleFilterClick(setIsCdMisFilterApplied, setIsZmroFilterApplied, setIsSuppFilterApplied, setIsTecoFilterApplied, setIsSuppDueFilterApplied, setIsSuppOverDueFilterApplied, setIsWipFilterApplied, setIsTecoSnoFilterApplied);
  //   const handleWipClick = () => handleFilterClick(setIsWipFilterApplied, setIsZmroFilterApplied, setIsSuppFilterApplied, setIsTecoFilterApplied, setIsSuppDueFilterApplied, setIsSuppOverDueFilterApplied, setIsCdMisFilterApplied, setIsTecoSnoFilterApplied);
  //   const handleTecoSnoClick = () => handleFilterClick(setIsTecoSnoFilterApplied, setIsZmroFilterApplied, setIsSuppFilterApplied, setIsTecoFilterApplied, setIsSuppDueFilterApplied, setIsSuppOverDueFilterApplied, setIsCdMisFilterApplied, setIsWipFilterApplied);

  // Create viewJSON object for saving custom views
  function createViewStateObject() {
    const { gridApi, columnApi } = agGridApis;

    let groupBy = 'noneSelected'; // Default groupBy option
    // Check if grouped by other than noneSelected
    if (vendorSelected) {
      groupBy = 'vendorSelected';
    } else if (customerNameSelected) {
      groupBy = 'customerNameSelected';
    } else if (shipToSelected) {
      groupBy = 'shipToSelected';
    }

    return {
      topFilters: topFilters ? topFilters : { facilities: [], shipTo: [], vendors: [], salesOffices: [], tiers: [] },
      gridFilters: gridApi.getFilterModel(),
      sorting: gridApi.getSortModel(),
      groupBy: groupBy,
      isChart1Checked: isChart1Checked,
      isChart2Checked: isChart2Checked,
      isGate1Checked: isGate1Checked,
      isGate2Checked: isGate2Checked,
      isGate3Checked: isGate3Checked,
      isSummaryChecked: isSummaryChecked,
      columns: columnApi
        .getAllColumns()
        .sort((column1, column2) => {
          return column1.left - column2.left;
        })
        .map(column => {
          return {
            colId: column.getColId(),
            width: column.actualWidth,
            hide: !column.visible,
          };
        }),
      selectedColumnsTitle: columnApi.getAllDisplayedColumns().map(column => {
        return column.userProvidedColDef.title;
      }),
      childGridModel: {
        assetGridModel: props.assetChildGridModel.assetGridModel,
      },
    };
  }

  function closeAllExpanded() {
    if (!agGridApis.gridApi) {
      return;
    }
    agGridApis.gridApi.forEachNode((rowNode, index) => {
      if (rowNode && rowNode.expanded) {
        rowNode.setExpanded(false);
      }
    });
  }

  function onCurrentViewChanged(view) {
    closeAllExpanded();
    agGridApis.gridApi.deselectAll();
    const viewId = view ? view.id : 1;
    if (view) {
      view.lastAccess = view.appUserId !== null ? Date.now() : '';
    }
    history.push(${location.pathname}?viewId=${viewId});
    localStorage.setItem(asset-mgmt-last-view-${userData.plant.sapPlant}, viewId);
    localStorage.setItem('expanded_column_list', '[]');
    setViewStateDirty(false);
  }

  const tagIndexMapping = {
    'Tier 1': 0,
    'Tier 2': 1,
    'Tier 3': 2,
  };

  function convertTagsToIndices(tags) {
    return tags.map(tag => (tagIndexMapping[tag] !== undefined ? tagIndexMapping[tag] : -1)).join(',');
  }
  function editTags(tags, identityKey, params, rowIndex) {
    const tagIndices = convertTagsToIndices(tags);

    let tagObj = {
      partShprtageId: identityKey,
      tags: tagIndices,
      woNo: params.data.woNo,
      soNo: params.data.soNo,
      notifNo: params.data.notifNo,
      plant: params.data.plant,
    };
    props.setTagsForAsset(tagObj);
  }

  const fetchFilteredData = () => {
    if (agGridApis.gridApi) {
      const filteredData = [];
      agGridApis.gridApi.forEachNodeAfterFilter(rowNode => {
        filteredData.push(rowNode.data);
      });
      return filteredData;
    }
  };

  const fetchGroupedData = () => {
    if (agGridApis.gridApi) {
      const groupedData = [];
      agGridApis.gridApi.forEachNode(node => {
        if (node.group) {
          node.setExpanded(true);
          groupedData.push(
            node.childrenAfterGroup.map(childNode => {
              return childNode.data;
            })
          );
        } else {
          groupedData.push(node.data);
        }
      });
      return groupedData;
    }
  };

  function goFullScreen() {
    AppInsights.trackEvent('Asset Maximize View');
    props.goFullScreen(props.currentAssetMgmtView, fetchGroupedData());
  }

  function editAgedWipCategory(category, params) {
    AppInsights.trackEvent('Asset EditAgedWipCategoryCalled');
    let aWCategoryObject = {
      plant: params.data.plant,
      notifNo: params.data.notifNo,
      agedWipCategory: category,
    };

    // Log the data being sent for update
    AppInsights.trackEvent('Asset AgedWipCategoryUpdated');

    props.updateAWCategory(aWCategoryObject);
  }

  function getUserFullName() {
    return props.userData === undefined ? '' : props.userData.firstName + ' ' + props.userData.lastName;
  }

  function editComments(comment, data) {
    AppInsights.trackEvent('Asset EditCommentsCalled');

    if (pasteProgress.current) {
      setPastComments(true);
    }
    let todayDate = moment(new Date()).format('MM/DD/YY');
    let userName = getUserFullName();

    const newValue = {
      woNo: data.woNo,
      notifNo: data.notifNo,
      text: comment,
      counter: data.counter,
      existingData: data.mmlLastCommentText,
      plant: data.plant,
      commentUser: userName,
      commentDate: todayDate,
    };

    //Before adding AppInsights Track Event
    // if (comment !== null && comment !== '') changesToRows.current.push(newValue);
    if (comment !== null && comment !== '') {
      changesToRows.current.push(newValue);
      AppInsights.trackEvent('Asset CommentEdited');
    }
  }

  function saveDataforWip2Navigation(rowIndex) {
    props.saveWip2RowIndex(rowIndex)
    props.saveFromTab(constants.NAVIGATION_FROM_WIP2)
  }

  //Maximize View
  useEffect(() => {
    if (props.enable.enable) {
      setShowFullScreen(true);
    } else {
      setShowFullScreen(false);
    }
  }, [props.enable.enable]);

  //Pie chart click
  const chartEvents = [
    {
      eventName: 'select',
      callback: ({ chartWrapper }) => {
        handlePieChartClick(chartWrapper);
      },
    },
  ];

  const warehousePctchartEvents = [
    {
      eventName: 'select',
      callback: ({ chartWrapper }) => {
        handleWarehousePctChartClick(chartWrapper);
      },
    },
  ];

  useEffect(() => {
    selectedCategoryRef.current = selectedCategory;
  }, [selectedCategory]);

  useEffect(() => {
    toggleChartDataRef.current = toggleChartData;
  }, [toggleChartData]);

  useEffect(() => {
    chartDataRef.current = chartData;
  }, [chartData]);

  const handlePieChartClick = chartWrapper => {
    const currentToggleChartData = toggleChartDataRef.current;
    const currentChartData = chartDataRef.current;
    const currentSelectedCategory = selectedCategoryRef.current;
    // Determine which data to use
    const dataToUse = currentToggleChartData.length > 0 ? currentToggleChartData : currentChartData;

    if (!dataToUse || dataToUse.length === 0) {
      return;
    }

    const chart = chartWrapper.getChart();
    if (chart) {
      const selection = chart.getSelection();
      if (selection.length > 0) {
        const selectedItem = selection[0];
        const newSelectedCategory = currentChartData[selectedItem.row]; // Get the selected category

        if (!newSelectedCategory) {
          return;
        }

        // Track the selected category click event
        AppInsights.trackEvent('Open Tasks Pie Chart Category Clicked');

        // Check if the selected category is the same as the previously selected category
        if (currentSelectedCategory && newSelectedCategory.Category === currentSelectedCategory.Category) {
          // If the same category is clicked again, reset the filter
          // clearAllFilters();
          setChartRowData(assetMgmtGridData);
          setSelectedCategory(null);
          setSelectedCategoryData([]);
          setChartData(currentChartData);

          // Track the reset event
          AppInsights.trackEvent('Open Tasks Pie Chart Category Reset');
        } else {
          // Filter rowData based on selected category

          const gridData = [];

          agGridApis.gridApi.forEachNodeAfterFilter(rowNode => {
            gridData.push(rowNode.data);
          });

          const anyChecked = Object.values(topFilters).some(filterArray => filterArray.some(filterItem => filterItem.checked));
          const dataToUseonClick = anyChecked ? gridData : assetMgmtGridData;

          const filteredData = dataToUseonClick.filter(item => {
            if (item.mmlOpenTasks && item.mmlOpenTasks.length > 0 && typeof item.mmlOpenTasks[0] === 'string') {
              const tasks = item.mmlOpenTasks[0].split(';').map(task => task.trim());
              return tasks.some(task => task.startsWith(newSelectedCategory.Category + '('));
            }
            return false;
          });

          const data = currentChartData.find(item => item.Category === newSelectedCategory.Category);

          setSelectedCategoryData(data);
          setChartRowData(filteredData);
          setSelectedCategory(newSelectedCategory);
          setChartData(currentChartData);

          // Track the data filtering event
          AppInsights.trackEvent('Open Tasks Pie Chart Category Filter Applied');
        }
      }
    }
  };

  function deselectTopFilters() {
    setTopFilters(filters => {
      filters.facilities.forEach(it => {
        it.checked = false;
      });
      filters.shipTo.forEach(it => {
        it.checked = false;
      });
      filters.salesOffices.forEach(it => {
        it.checked = false;
      });
      filters.vendors.forEach(it => {
        it.checked = false;
      });
      filters.tiers.forEach(it => {
        it.checked = false;
      });
      return Object.assign({}, filters);
    });
  }

  //Clear All filters
  function clearAllFilters() {
    AppInsights.trackEvent('Asset ClearAllFiltersCalled');

    deselectTopFilters();

    const filters = agGridApis.gridApi.filterManager.allFilters;

    // Log the current filters before resetting
    AppInsights.trackEvent('Asset CurrentFiltersBeforeClear');

    for (const filterKey in filters) {
      if (!filters.hasOwnProperty(filterKey)) {
        continue;
      }
      filters[filterKey].filterPromise.then(it => {
        it.componentInstance.reset();
        it.componentInstance.clearAdvancedFilter();
      });
    }

    if (gridApiRef.current) {
      // Clear filters
      // gridApiRef.current.setFilterModel(null);

      // Clear row data
      setChartRowData([]);
      setSelectedCategoryData([]);

      assetMgmtGroupBy('noneSelected');
      LocalStorage.setItem('asset_mgmt_group_by_selection', 'None');
      setIsZmroFilterApplied(false);
      setIsSuppFilterApplied(false);
      setIsTecoFilterApplied(false);
      setIsSuppDueFilterApplied(false);
      setIsSuppOverDueFilterApplied(false);
      setIsCdMisFilterApplied(false);
      setIsWipFilterApplied(false);
      setIsTecoSnoFilterApplied(false);
      setIsLateOrderFilterApplied(false);

      // Log that filters have been cleared
      AppInsights.trackEvent('Asset AllFiltersCleared');
    }
  }

  // function required by ag grid in order to expand a row
  function getRowHeight(params) {
    /* if row constains nested data calculate height of the row
    to append table into it, otherwise row height is 60px */
    if (params.node.flower) {
      return 225;
    } else {
      return 60;
    }
  }

  function getRowStyle(params) {
    /* if row constains nested data calculate height of the row
    to append table into it, otherwise row height is 60px */
    if (params.node.flower) {
      return { maxHeight: '250px' }; //overflow:'scroll',
    }

    if (params.node.rowIndex % 2 !== 0) {
      return { background: '#F7F7F7' };
    }
  }

  // Refresh page
  function refreshData() {
    if (agGridApis.gridApi && agGridApis.gridApi.showLoadingOverlay) {
      agGridApis.gridApi.showLoadingOverlay();
    }

    AppInsights.trackEvent('Asset Management Refresh');

    if (userData && userData.appUserPlants) {
      const userPlants = userData.appUserPlants.map(aup => aup.userPlant.sapPlant);

      if (userPlants && userPlants.length > 0) {
        fetchData(userPlants);
      }
    }
  }

  useEffect(() => {
    if (assetMgmtGridData) {
      const anyChecked = Object.values(topFilters).some(filterArray => filterArray.some(filterItem => filterItem.checked));

      const gridData = [];

      if (agGridApis && agGridApis.gridApi) {
        agGridApis.gridApi.forEachNodeAfterFilter(rowNode => {
          if (rowNode.data && rowNode.data.notifCreateDate) {
            gridData.push(rowNode.data);
          }
        });
      }
      const wipDataToUse = anyChecked ? gridData : assetMgmtGridData;

      const filteredDateWipByAge = wipDataToUse.map(data => data.notifCreateDate);
      setDatesWipByAge(filteredDateWipByAge);
    }
  }, [assetMgmtGridData, filterChanged]);

  useEffect(() => {
    if (datesWipByAge) {
      calculateWipByAge(datesWipByAge);
    }
  }, [datesWipByAge]);

  useEffect(() => {
    if (wipByAgeInDays) {
      countDaysInRange(wipByAgeInDays);
    }
  }, [wipByAgeInDays]);

  const calculateWipByAge = datesWipByAge => {
    const wipByAgeDates = [];
    datesWipByAge.map(dateWipByAge => {
      const givenDate = moment(dateWipByAge); // Use moment to parse the given date
      const today = moment(); // Get today's date using moment
      const differenceInDays = today.diff(givenDate, 'days'); // Use moment's diff method to calculate difference in days
      wipByAgeDates.push(differenceInDays);
    });
    setWipByAgeInDays(wipByAgeDates);
  };

  const countDaysInRange = wipByAgeInDays => {
    const wipByAgeCountZeroToThirty = wipByAgeInDays.filter(day => day >= 0 && day <= 30).length;
    setWipByAgeCountZeroToThirty(wipByAgeCountZeroToThirty);
    const wipByAgeCountThirtyoneToNinety = wipByAgeInDays.filter(day => day >= 31 && day <= 90).length;
    setWipByAgeCountThirtyoneToNinety(wipByAgeCountThirtyoneToNinety);
    const wipByAgeCountNinetyAndAbove = wipByAgeInDays.filter(day => day > 90).length;
    setWipByAgeCountNinetyAndAbove(wipByAgeCountNinetyAndAbove);
  };

  useEffect(() => {
    selectedRangeRef.current = selectedRange;
  }, [selectedRange]);

  const wipByAgeChartEvents = [
    {
      eventName: 'select',
      callback: ({ chartWrapper }) => {
        handleWipByAgePieChartClick(chartWrapper);
      },
    },
  ];

  useEffect(() => {
    assetDataRef.current = assetMgmtGridData;
  }, [assetMgmtGridData]);

  const handleWipByAgePieChartClick = chartWrapper => {
    const assetChartData = assetDataRef.current;
    const chart = chartWrapper.getChart();
    if (chart) {
      const selection = chart.getSelection();
      if (selection.length > 0) {
        const selectedItem = selection[0];
        const newSelectedRange = selectedItem.row; // Get the selected category

        // Track the range selection event
        AppInsights.trackEvent('WIP by Age Pie Chart Range Selected');

        if (newSelectedRange === selectedRangeRef.current) {
          // If the same category is clicked again, reset the filter
          // clearAllFilters();
          setChartRowData(assetChartData);
          setSelectedRange(null);

          // Track the reset event
          AppInsights.trackEvent('WIP by Age Pie Chart Range Reset');
        } else {
          const filteredNotifCreateDate = assetChartData && assetChartData.map(item => item.notifCreateDate);
          const today = moment(); // Get today's date
          const thirtyDaysAgo = today.clone().subtract(30, 'days');
          const thirtyOneDays = today.clone().subtract(31, 'days');
          const ninetyDaysAgo = today.clone().subtract(90, 'days'); // 90 days ago from
          let filteredDates = [];
          if (newSelectedRange === 0) {
            filteredDates = filteredNotifCreateDate.filter(notifCreateDate => {
              const createDate = moment(notifCreateDate);
              return createDate.isBetween(thirtyDaysAgo, today, 'days', '[]'); // Check if the date is between 30 days ago and today (inclusive)
            });
          } else if (newSelectedRange === 1) {
            filteredDates = filteredNotifCreateDate.filter(notifCreateDate => {
              const createDate = moment(notifCreateDate);
              return createDate.isBetween(ninetyDaysAgo, thirtyOneDays, 'days', '[]'); // Check if the date is between 31 and 90 days ago
            });
          } else {
            filteredDates = filteredNotifCreateDate.filter(notifCreateDate => {
              const createDate = moment(notifCreateDate);
              return createDate.isBefore(ninetyDaysAgo, 'days'); // Check if the date is older than 90 days
            });
          }

          const filteredObject = assetChartData.filter(item => filteredDates.includes(item.notifCreateDate));
          setSelectedRange(newSelectedRange);
          setChartRowData(filteredObject);

          // Track the filtering event
          AppInsights.trackEvent('WIP by Age Pie Chart Filter Applied');
        }
      }
    }
  };

  function refreshData() {
    if (agGridApis.gridApi && agGridApis.gridApi.showLoadingOverlay) {
      agGridApis.gridApi.showLoadingOverlay();
    }

    AppInsights.trackEvent('Asset Management Refresh');

    if (assetMgmtGridData && assetMgmtGridData.length > 0) {
      const userPlants = assetMgmtGridData.map(aup => aup.plant);
      const uniquePlants = [...new Set(userPlants)];
      if (uniquePlants && uniquePlants.length > 0) {
        fetchData(uniquePlants);
      }
    }
  }

  useEffect(() => {
    if (!isFetchingAssetMgmt && agGridApis.gridApi && agGridApis.gridApi.hideOverlay) {
      agGridApis.gridApi.hideOverlay();
    }
  }, [isFetchingAssetMgmt, agGridApis.gridApi]);

  function rowChildgridMapping(counter, column, expand, rowdata) {
    var currentState = childGridInfo;

    var existingCounter = currentState.length > 0 ? (currentState.findIndex(x => x.parentRow.counter === counter) >= 0 ? currentState.findIndex(x => x.parentRow.counter === counter) : '-1') : '-1';

    if (expand) {
      if (existingCounter > -1) {
        currentState.splice(existingCounter, 1);
      }

      var newRow = { counter: counter, currentColumn: column, parentRow: rowdata }; // current Column with be "ORP_RISK", "ENG_RISK" etc.. defined in constants - no hardcoding
      currentState.push(newRow);
    } else {
      currentState.splice(existingCounter, 1);
    }

    setchildGridInfo(currentState);
  }

  function populateExpandedState(row, refCol) {
    let data = row.data;
    var getObjectByValue = function (array, key, value) {
      return array.filter(function (object) {
        var obj = JSON.parse(object);
        return obj[key] === value;
      });
    };

    let mmlExpandedColumnList = JSON.parse(LocalStorage.getItem('expanded_column_list')) || [];
    let expandedColumn = getObjectByValue(mmlExpandedColumnList, 'counter', data['counter']);
    if (expandedColumn === null || expandedColumn === undefined || expandedColumn.length === 0) {
      expandedColumn = { counter: data['counter'], expanded_column: refCol };
      mmlExpandedColumnList.push(JSON.stringify(expandedColumn));
    } else {
      expandedColumn = JSON.parse(expandedColumn);
      expandedColumn['expanded_column'] = refCol;
      for (var n = 0; n < mmlExpandedColumnList.length; n++) {
        var obj = JSON.parse(mmlExpandedColumnList[n]);
        if (obj.counter === data['counter']) {
          mmlExpandedColumnList[n] = JSON.stringify(expandedColumn);
          break;
        }
      }
    }
    LocalStorage.setItem('expanded_column_list', JSON.stringify(mmlExpandedColumnList));
  }

  function collapseRow(row, refCol, counter, rowData) {
    closeAnyExpandedTable(row);

    var currentState = childGridInfo;

    if (currentState.length > 0) {
      var existingStateObjectId = currentState.findIndex(x => x.parentRow.counter === counter);

      if (existingStateObjectId >= 0) {
        if (currentState[existingStateObjectId].currentColumn === refCol) {
          rowChildgridMapping(counter, refCol, false, rowData);
        } else {
          if (doesNeedExpansion(refCol, rowData)) {
            rowChildgridMapping(counter, refCol, true, rowData);
            expandRow(row, refCol);
            applyChildGridViewModel(refCol);
          }
        }
      }
    }
  }

  function closeAnyExpandedTable(row) {
    row.setExpanded(false);
    var column = document.querySelectorAll('.ag-row[row-id="' + row.id + '"] .expander > div');

    if (column !== null && column !== undefined) {
      column.forEach(el => el.classList.add('right'));
    }
  }

  function applyChildGridViewModel(type) {
    //If user save any preference take view model from current View object other set default preferences from props
    //  let currentViewChildGridModel = props.currentAssetMgmtView !==undefined ? JSON.parse(props.currentAssetMgmtView.viewJSON).childGridModel.assetGridModel: undefined
    let currentViewChildGridModel;
    if (props.currentAssetMgmtView && props.currentAssetMgmtView.viewJSON) {
      const viewObject = JSON.parse(props.currentAssetMgmtView.viewJSON);
      if (viewObject.childGridModel && viewObject.childGridModel.assetGridModel) {
        currentViewChildGridModel = viewObject.childGridModel.assetGridModel;
      } else {
        currentViewChildGridModel = undefined;
      }
    } else {
      currentViewChildGridModel = undefined;
    }

    let newGridModel = (function (type) {
      switch (type) {
        case constants.ASSET_MGMT_CHILD:
          return props.assetChildGridModel.assetGridModel;

        default:
          return '';
      }
    })(type);
    if (currentViewChildGridModel !== undefined) {
      newGridModel = (function (type) {
        switch (type) {
          case constants.ASSET_MGMT_CHILD:
            return currentViewChildGridModel.assetGridModel;

          default:
            return '';
        }
      })(type);
    }

    if (newGridModel !== undefined && newGridModel !== null) {
      let sortModel = newGridModel.sortModel;
      let columnModel = newGridModel.columnModel;
      if (sortModel !== undefined && columnModel !== undefined) {
        props.updateChildgridModel(type, '', sortModel, columnModel, true);
      }
    }
  }

  function expandRow(row, refCol) {
    var colType = '.expander.' + refCol;
    row.setExpanded(true);
    var column = document.querySelector('.ag-row[row-id="' + row.id + '"] ' + colType + '  > div');
    if (column !== null && column !== undefined) {
      column.classList.remove('right') || column.classList.remove('poRight');
    }

    populateExpandedState(row, refCol);

    // analytics
    AppInsights.trackEvent('Expand To View child grid for: ' + refCol);
    try {
      window.resetQualtricsVars();
      window.isWip2Expansion = true;
      window.qualtricsInit();
    } catch (e) {
      console.error(e);
    }
  }

  function onCellMouseOver(event) {
    let renderer = event.api.getCellRendererInstances({
      rowNodes: [event.node],
      columns: ['orderDetailsButton'],
    })[0];

    if (renderer == null) return;
    const fwCmpInstance = renderer.getFrameworkComponentInstance();
    fwCmpInstance.showButtons();
  }

  function onCellMouseOut(event) {
    let renderer = event.api.getCellRendererInstances({
      rowNodes: [event.node],
      columns: ['orderDetailsButton'],
    })[0];

    if (renderer == null) return;

    const fwCmpInstance = renderer.getFrameworkComponentInstance();
    fwCmpInstance.hideButtons();
  }

  function processCellFromClipboard(cell) {
    // pasteProgress.current = true
    return !!cell.column.colDef.importTransform ? cell.column.colDef.importTransform(cell) : cell.value;
  }

  function navigateToOrderDetails(cell) {
    props.saveFromTab(constants.NAVIGATION_FROM_WIP2);
    const { woNo, soNo, notifNo } = cell;

    const basePath = constants.APP_BASE_PATH;
    let pathName = '';
    if (basePath === 'undefined' || basePath === '') {
      pathName = /#/details/${woNo}-${soNo}-${notifNo}?t= + moment();
    } else {
      pathName = '/' + basePath + /#/details/${woNo}-${soNo}-${notifNo}?t= + moment();
    }

    const location = {
      pathname: pathName,
      state: {
        fromTab: constants.NAVIGATION_FROM_WIP2,
      },
    };
    LocalStorage.setItem('order-details-fromTab', location.state.fromTab);

    window.showModalPopUp(location.pathname, 'NAVIGATION_FROM_WIP2', -1);
  }

  function createSubTables(params) {
    const counter = params.data.mroCounter;
    var childGridInfoState = childGridInfo || [];
    var childgridTypeInfo = childGridInfoState.filter(x => x.parentRow.mroCounter === counter);
    if (childgridTypeInfo && childgridTypeInfo.length > 0) {
      const type = childgridTypeInfo[0].currentColumn;
      if (type === constants.ASSET_MGMT_CHILD && params.data.mroPlant) {
        return (
          <div style={{ maxHeight: '200px' }}>
            <AssetChildGrid type={type} parentRow={childgridTypeInfo[0].parentRow} navigateToOrderDetails={navigateToOrderDetails} />
          </div>
        );
      }
      if (type === constants.OPEN_TASK) {
        return (
          <div className='wip-child-grid-container' style={{ maxHeight: '200px', backgroundColor: '#F4F7FF' }}>
            <TaskChildGrid type={type} parentRow={childgridTypeInfo[0].parentRow} />
          </div>
        )
      }
    }
    return null;
  }

  function doesNeedExpansion(columntype, data) {
    var riskData = (function (columntype) {
      switch (columntype) {
        case constants.ASSET_MGMT_CHILD:
          if (data) {
            return data;
          }
        case constants.OPEN_TASK:
          return data.mmlOpenTasks.length === 0 ? '' : 1
        default:
          return '';
      }
    })(columntype);

    return riskData !== '' ? (riskData === 0 ? false : true) : false;
  }

  function isFullWidthCell(rowNode) {
    const rowIsNestedRow = rowNode.flower;
    return rowIsNestedRow;
  }

  useEffect(() => {
    if (props.sendViewFetching && showSendViewModal) {
      setShowSendViewModal(false);
    } else if (props.sendViewError) {
      setShowSendViewModal(true);
    }
  }, [props.sendViewFetching, props.sendViewError]);

  function onCellValueChanged(e) {
    if (pasteProgress.current) {
      return;
    }

    if (e.column.colId === 'mmlLastCommentText') {
      if (changesToRows.current.length > 0) {
        props.updateComments(changesToRows.current, true); //is copyPaste true
        changesToRows.current = [];
      }
    }
  }

  function onPasteEnd() {
    pasteProgress.current = false;
    if (isPasteComments) {
      setPastComments(false);
      if (changesToRows.current.length > 0) {
        props.updateComments(changesToRows.current, true);
        changesToRows.current = [];
        AppInsights.trackEvent('Asset Comments Copy Paste');
      }
    }
  }

  useEffect(() => {
    if (agGridApis.gridApi) {
      setSelectedRows(agGridApis.gridApi.getSelectedRows());
    }
  }, [props.isFetchingAssetMgmt]);

  // useEffect(() => { // This causes performance issues when clicking header checkbox and there is 100+ rows in the grid
  //   if (!agGridApis.gridApi) {
  //     return;
  //   }

  //   const rowSelectedEvent = 'rowSelected';

  //   const rowSelected = () => {
  //     setSelectedRows(agGridApis.gridApi.getSelectedRows());
  //   };
  //   agGridApis.gridApi.addEventListener(rowSelectedEvent, rowSelected);
  //   return () => {
  //     agGridApis.gridApi.removeEventListener(rowSelectedEvent, rowSelected);
  //   };
  // }, [agGridApis.gridApi]);

  useEffect(() => {
    if (assetMgmtGridData && agGridApis && agGridApis.gridApi) {
      agGridApis.gridApi.setRowData(assetMgmtGridData);
    }
  }, [assetMgmtGridData, agGridApis]);

  // const extractRowData = (dataSources) => {
  //   if ((isTecoFilterApplied && tecoPoCount === 0) || (isZmroFilterApplied && zmroPoCount === 0) ||
  //   (isSuppFilterApplied && suppRcvdDateMissingCount === 0) || (isSuppDueFilterApplied && suppDueNextCount === 0) ||
  //   (isSuppOverDueFilterApplied && suppDueCount === 0) || (isCdMisFilterApplied && costDesgMisCount === 0) ||
  //   (isWipFilterApplied && wipUnqueuedCount === 0) ||  (isTecoSnoFilterApplied && snoOpenCount === 0))
  //   {
  //     return []; // Return an empty array for zero rows
  // }

  //   for (const data of dataSources) {
  //     if (Array.isArray(data) && data.length > 0) {
  //       // Check if the first item has a 'data' property
  //       if (data[0] && typeof data[0] === 'object' && 'data' in data[0]) {
  //         return data.map(node => node.data).filter(Boolean);
  //       }
  //       // If it's a regular array, return it
  //       return data;
  //     }
  //   }
  //   return [];
  // };

  const onSelectionChanged = params => {
    let newSelectedRows = params.api.getSelectedNodes();
    let selectedRowsCount = newSelectedRows.length;

    const isHeaderCheckbox = selectedRowsCount === params.api.getDisplayedRowCount();

    if (isHeaderCheckbox && selectedRows.length === maxSelection) {
      // If already selected max amount of rows this allows deselecting all with the header checkbox
      params.api.deselectAll();
    } else if (isHeaderCheckbox) {
      // If header checkbox is used, select the the rows from top to bottom until reaching the maximum selection allowed
      let allNodesFilteredAndSorted = [];
      params.api.forEachNodeAfterFilterAndSort(node => allNodesFilteredAndSorted.push(node));
      let newRowsToSelect = allNodesFilteredAndSorted.slice(0, maxSelection);
      params.api.deselectAll();
      newRowsToSelect.forEach(row => {
        row.setSelected(true);
      });
    } else if (selectedRowsCount > maxSelection) {
      // If selecting rows individually, keep the rows that were selected before the limit was reached
      newSelectedRows = params.api.getSelectedNodes().slice(0, maxSelection);
      params.api.deselectAll();

      newSelectedRows.forEach(row => {
        row.setSelected(true);
      });
    }

    // Update selectedRows state for action button
    const updatedSelectedRows = params.api.getSelectedRows();
    setSelectedRows(updatedSelectedRows);
  };

  const filteredDataSources = [
    {
      chartRowData: chartRowData,
      gateData: gateData,
      assetMgmtGridData: assetMgmtGridData,
    },
  ];
  const gateFilter = filteredDataSources.flatMap(gate => {
    if (gate.assetMgmtGridData === null) {
      return [];
    }
    if (!gate.gateData && gate.chartRowData.length > 0) {
      return gate.chartRowData;
    } else if (gate.gateData) {
      if (gate.gateData && Array.isArray(gate.gateData)) {
        if (gate.gateData.some(node => node && typeof node === 'object' && 'data' in node)) {
          return gate.gateData.map(node => node.data).filter(Boolean);
        }
      }
      return gate.gateData;
    } else if (gate.gateData && gate.chartRowData.length > 0) {
      return gate.chartRowData;
    } else {
      return gate.assetMgmtGridData;
    }
  });

  const rowData = gateFilter;

  const [selectedChartOption1, setSelectedChartOption1] = useState('Chart: WIP By Age');
  const [selectedChartOption2, setSelectedChartOption2] = useState('Chart: Open Tasks');

  const handleOptionSelect1 = option => {
    setSelectedChartOption1(option);
  };

  const handleOptionSelect2 = option => {
    setSelectedChartOption2(option);
  };
  const options = ['Chart: WIP By Age', 'Chart: Open Tasks', 'Chart: Priority', 'Chart: Warehouse %of Target', 'Chart: Days Until Order ESD', 'Chart: Customer vs Pool orders'];

  const [anchorEl, setAnchorEl] = useState(null);

  const handleTogglePopper = event => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const isPopperOpen = Boolean(anchorEl);

  const handleToggle = () => {
    setToggle(!toggle);
  };

  const handleToggleChart1 = () => {
    setIsChart1Checked(!isChart1Checked);
  };

  const handleToggleChart2 = () => {
    setIsChart2Checked(!isChart2Checked);
  };

  const handleToggleGate1 = () => {
    setIsGate1Checked(!isGate1Checked);
  };

  const handleToggleGate2 = () => {
    setIsGate2Checked(!isGate2Checked);
  };

  const handleToggleGate3 = () => {
    setIsGate3Checked(!isGate3Checked);
  };

  const handleToggleSummary = () => {
    setIsSummaryChecked(!isSummaryChecked);
  };

  const generateWarehouseData = (assetMgmtGridData) => {
    const warehouseData = {
      "76-100%": 0,
      "51-75%": 0,
      "26-50%": 0,
      "11-25%": 0,
      "6-10%": 0,
      "0-5%": 0
    };

    assetMgmtGridData && assetMgmtGridData.forEach(item => {
      let pct = item.warehousePctOfTarget;

      if (typeof pct !== "number" || isNaN(pct)) {
        return; // Skip invalid or missing values
      }

      if (pct >= 0.76 && pct <= 1.0) {
        warehouseData["76-100%"] += 1;
      } else if (pct >= 0.51 && pct < 0.76) {
        warehouseData["51-75%"] += 1;
      } else if (pct >= 0.26 && pct < 0.51) {
        warehouseData["26-50%"] += 1;
      } else if (pct >= 0.11 && pct < 0.26) {
        warehouseData["11-25%"] += 1;
      } else if (pct >= 0.06 && pct < 0.11) {
        warehouseData["6-10%"] += 1;
      } else {
        warehouseData["0-5%"] += 1;
      }
    });

    // Convert warehouseData object into an array format suitable for the chart
    return [
      ["Category", "Count"], // Chart Headers
      ...Object.entries(warehouseData) // Convert object into array pairs
    ];
  };

  // Example Usage
  const warehouseChartData = generateWarehouseData(assetMgmtGridData);

  useEffect(() => {
    setwarehouseMgmtGridData(warehouseChartData);
  }, [assetMgmtGridData]);  // Runs only when assetMgmtGridData changes

  const handleWarehousePctChartClick = (chartWrapper) => {
    const currentChartData = chartDataRef.current;
    const currentSelectedCategory = selectedCategoryRef.current;
    console.log("currentSelectedCategory >> ",currentSelectedCategory)
    if (!currentChartData || currentChartData.length === 0) {
        return;
    }

    const chart = chartWrapper.getChart();
    if (chart) {
        const selection = chart.getSelection();
        if (selection.length > 0) {
            const selectedItem = selection[0];
            const newSelectedCategory = currentChartData[selectedItem.row + 1]; // +1 to skip header row

            if (!newSelectedCategory) {
                return;
            }

            // Track the event
            AppInsights.trackEvent("Warehouse % of Target Chart Category Clicked");

            // If the same category is clicked again, reset the filter
            if (currentSelectedCategory && newSelectedCategory[0] === currentSelectedCategory[0]) {
                setChartRowData(warehouseMgmtGridData);
                setSelectedCategory(null);
                setSelectedCategoryData([]);
                setChartData(currentChartData);

                // Track reset event
                AppInsights.trackEvent("Warehouse % of Target Chart Category Reset");
            } else {
                // Get selected category name
                const selectedCategoryName = newSelectedCategory[0];

                // Filter the data
                const filteredData = warehouseMgmtGridData.filter(item => {
                    if (item.warehouseOpenTasks && Array.isArray(item.warehouseOpenTasks)) {
                        return item.warehouseOpenTasks.some(task => task.startsWith(selectedCategoryName + "("));
                    }
                    return false;
                });

                console.log("Filtered Data >>> ", filteredData);

                setSelectedCategoryData(newSelectedCategory);
                setChartRowData(filteredData);
                setSelectedCategory(newSelectedCategory);
                setChartData(currentChartData);

                // Track filtering event
                AppInsights.trackEvent("Warehouse % of Target Chart Category Filter Applied");
            }
        }
    }
};

  return (
    <div className="asset-mgmt-container">
      <p className="toggleLink" onClick={toggleCollapse}>
        <img src={isCollapsed ? ArrowRight : ArrowLeft} alt={isCollapsed ? 'Expand' : 'Collapse'} className="arrow-icon" />
        View Options
      </p>
      <div className={asset-mgmt-left-container ${isCollapsed ? 'collapsed' : 'expanded'}}>
        <div className="left-panel">
          <AssetMgmtSearchFilters
            isHutas={isHutas}
            shipTo={shipTo}
            setShipTo={setShipTo}
            facilities={facilities}
            setFfacilities={facilities}
            salesOffices={salesOffices}
            setSalesOffice={setSalesOffice}
            vendors={vendors}
            setVendors={setVendors}
            assetMgmtGridData={assetMgmtGridData}
            onTopLevelFiltersChanged={onTopLevelFiltersChanged}
            doTopLevelFiltersPass={doTopLevelFiltersPass}
            topFilters={topFilters}
            assetMgmtGroupBy={assetMgmtGroupBy}
            onCurrentViewChanged={onCurrentViewChanged}
            notificationTabChanged={viewStateDirty ? 'Unsaved Changes' : ''}
            setShowSaveCustomViewModal={setShowSaveCustomViewModal}
            addAssetMgmtViewToFavourite={addAssetMgmtViewToFavourite}
            deleteAssetMgmtView={deleteAssetMgmtView}
            setShowSendViewModal={setShowSendViewModal}
            currentAssetMgmtView={props.currentAssetMgmtView}
            noneSelected={noneSelected}
            currentGroupByOption={props.currentGroupByOption}
          />
          {showSendViewModal && (
            <SendViewModal
              viewName={props.currentAssetMgmtView.name}
              sending={props.sendViewFetching}
              onClose={() => setShowSendViewModal(false)}
              requestUsers={props.requestUsers}
              users={props.users}
              onConfirm={recipients => {
                shareGridView(props.currentAssetMgmtView.name, recipients, props.currentAssetMgmtView.viewJSON);
                AppInsights.trackEvent('Asset Send View');
                window.resetQualtricsVars();
                window.isPSShareAView = true;
                window.qualtricsInit();
              }}
            />
          )}

          <div className="toggle-panel-container">
            <div className="toggle-left-panel-container" onClick={handleToggle}>
              <div className="toggle-left-panel-icon">
                <span className={material-icons ${toggle ? 'circle-icon-dark' : 'circle-icon'}}>
                  <img className="image-color" src={FilterIcon} alt="Toggle" />
                </span>
                <span className="tooltiptext">Toggle</span>
              </div>
              <div className="toggle-panel-text">Open Filters</div>
            </div>
            <div className="toggle-right-panel-container" onClick={handleTogglePopper}>
              <div className="toggle-right-panel-icon">
                <span className={material-icons ${!isPopperOpen ? 'circle-icon-dark' : 'circle-icon'}}>
                  <img className="image-color" src={PanelConfig} alt="Toggle" />
                </span>
              </div>
              <div className="toggle-panel-text">Panel Config</div>
            </div>
          </div>

          <AssetPanelConfig
            anchorEl={anchorEl}
            setAnchorEl={setAnchorEl}
            isPopperOpen={isPopperOpen}
            options={options}
            isChart1Checked={isChart1Checked}
            isChart2Checked={isChart2Checked}
            isGate1Checked={isGate1Checked}
            isGate2Checked={isGate2Checked}
            isGate3Checked={isGate3Checked}
            isSummaryChecked={isSummaryChecked}
            selectedOption={selectedChartOption1}
            onOptionSelect1={handleOptionSelect1}
            selectedChartOption2={selectedChartOption2}
            onOptionSelect2={handleOptionSelect2}
            handleToggle={handleToggleChart1}
            handleToggleChart2={handleToggleChart2}
            handleToggleGate1={handleToggleGate1}
            handleToggleGate2={handleToggleGate2}
            handleToggleGate3={handleToggleGate3}
            handleToggleSummary={handleToggleSummary}
          />

          {toggle ? (
            <>
              {isChart1Checked && (
                <div className="taskSection">
                  {selectedChartOption1 === 'Chart: Open Tasks' && (
                    <div className="AssetopenTaskSection">
                      <div className="assetVisibleText">
                        <p className="openTaskSection">OPEN TASKS</p>
                        <div className="assetOpenTaskDropDown">
                          <AssetSearchMultiselectDropdownV2 title="Select Visible Tasks" items={tasks} selectionUpdated={toggleItemSelection} />
                        </div>
                      </div>
                    </div>
                  )}
                  {selectedChartOption1 === 'Chart: WIP By Age' && (
                    <AssetMgmtWipByAge
                      wipByAgeCountZeroToThirty={wipByAgeCountZeroToThirty}
                      wipByAgeCountThirtyoneToNinety={wipByAgeCountThirtyoneToNinety}
                      wipByAgeCountNinetyAndAbove={wipByAgeCountNinetyAndAbove}
                      chartEvents={wipByAgeChartEvents}
                      gridApi={agGridApis.gridApi}
                      topFilters={topFilters}
                      assetMgmtGridData={assetMgmtGridData}
                    />
                  )}

                  {selectedChartOption1 === 'Chart: Open Tasks' && <AssetOpenTasksChart data={chartData} chartEvents={chartEvents} selectedCategory={selectedCategory} tasks={tasks} />}
                  {selectedChartOption1 === 'Chart: Warehouse %of Target' && <WarehouseChart warehouseChartData={warehouseMgmtGridData} chartEvents={warehousePctchartEvents}  selectedCategory={selectedCategory}/>}
                  {selectedChartOption1 === 'Chart: Customer vs Pool orders' && <CustomerVsOrders />}
                  {selectedChartOption1 === 'Chart: Priority' && <PriorityChart />}
                  {selectedChartOption1 === 'Chart: Days Until Order ESD' && <ESDChart />}
                </div>
              )}

              {isChart2Checked && (
                <div className="taskSection">
                  {selectedChartOption2 === 'Chart: Open Tasks' && (
                    <div className="AssetopenTaskSection">
                      <div className="assetVisibleText">
                        <p className="openTaskSection">OPEN TASKS</p>
                        <div className="assetOpenTaskDropDown">
                          <AssetSearchMultiselectDropdownV2 title="Select Visible Tasks" items={tasks} selectionUpdated={toggleItemSelection} />
                        </div>
                      </div>
                    </div>
                  )}
                  {selectedChartOption2 === 'Chart: WIP By Age' && (
                    <AssetMgmtWipByAge
                      wipByAgeCountZeroToThirty={wipByAgeCountZeroToThirty}
                      wipByAgeCountThirtyoneToNinety={wipByAgeCountThirtyoneToNinety}
                      wipByAgeCountNinetyAndAbove={wipByAgeCountNinetyAndAbove}
                      chartEvents={wipByAgeChartEvents}
                      gridApi={agGridApis.gridApi}
                      topFilters={topFilters}
                      assetMgmtGridData={assetMgmtGridData}
                    />
                  )}

                  {selectedChartOption2 === 'Chart: Open Tasks' && <AssetOpenTasksChart data={chartData} chartEvents={chartEvents} selectedCategory={selectedCategory} tasks={tasks} />}
                  {selectedChartOption2 === 'Chart: Warehouse %of Target' && <WarehouseChart />}
                  {selectedChartOption2 === 'Chart: Customer vs Pool orders' && <CustomerVsOrders />}
                  {selectedChartOption2 === 'Chart: Priority' && <PriorityChart />}
                  {selectedChartOption2 === 'Chart: Days Until Order ESD' && <ESDChart />}
                </div>
              )}

              <div className="gateSection">
                {isGate1Checked && (
                  <div className="gate1Section">
                    <p className="gateSectionText">GATE1 - ORDER GENERATION</p>

                    <p
                      onClick={handleZmroClick}
                      style={{ backgroundColor: isZmroFilterApplied ? '#d9e2ff' : 'transparent', height: isZmroFilterApplied ? '32px' : 'auto', borderRadius: isZmroFilterApplied ? '4px' : '0' }}
                    >
                      <span className="gateCount">{zmroPoCount}</span>
                      <span className="text">No ZMRO PO</span>
                    </p>
                  </div>
                )}
                {isGate2Checked && (
                  <div className="gate2Section">
                    <p className="gateSectionText">GATE2 - CORE MANAGEMENT</p>

                    <p
                      onClick={handleSuppClick}
                      style={{ backgroundColor: isSuppFilterApplied ? '#d9e2ff' : 'transparent', height: isSuppFilterApplied ? '32px' : 'auto', borderRadius: isSuppFilterApplied ? '4px' : '0' }}
                    >
                      <span className="gateCount">{suppRcvdDateMissingCount}</span>
                      <span className="text">Supplier Received Date Missing</span>
                    </p>

                    <p
                      onClick={handleTecoClick}
                      style={{ backgroundColor: isTecoFilterApplied ? '#d9e2ff' : 'transparent', height: isTecoFilterApplied ? '32px' : 'auto', borderRadius: isTecoFilterApplied ? '4px' : '0' }}
                    >
                      <span className="gateCount">{tecoPoCount}</span>
                      <span className="text">TECO'd PO Open</span>
                    </p>
                    <p
                      onClick={handleSuppDueClick}
                      style={{
                        backgroundColor: isSuppDueFilterApplied ? '#d9e2ff' : 'transparent',
                        height: isSuppDueFilterApplied ? '32px' : 'auto',
                        borderRadius: isSuppDueFilterApplied ? '4px' : '0',
                      }}
                    >
                      <span className="gateCount">{suppDueNextCount}</span>
                      <span className="text">Supplier Due Next 7 Days</span>
                    </p>
                    <p
                      onClick={handleSuppOverDueClick}
                      style={{
                        backgroundColor: isSuppOverDueFilterApplied ? '#d9e2ff' : 'transparent',
                        height: isSuppOverDueFilterApplied ? '32px' : 'auto',
                        borderRadius: isSuppOverDueFilterApplied ? '4px' : '0',
                      }}
                    >
                      <span className="gateCount">{suppDueCount}</span>
                      <span className="text">Supplier OverDue</span>
                    </p>
                    <p
                      onClick={handleCdMisClick}
                      style={{ backgroundColor: isCdMisFilterApplied ? '#d9e2ff' : 'transparent', height: isCdMisFilterApplied ? '32px' : 'auto', borderRadius: isCdMisFilterApplied ? '4px' : '0' }}
                    >
                      <span className="gateCount">{costDesgMisCount}</span>
                      <span className="text">Cost Designator Mismatch</span>
                    </p>

                    <p
                      onClick={handleLateOrderClick}
                      style={{ backgroundColor: isLateOrderFilterApplied ? '#d9e2ff' : 'transparent', height: isLateOrderFilterApplied ? '32px' : 'auto', borderRadius: isLateOrderFilterApplied ? '4px' : '0' }}
                    >
                      <span className="gateCount">{lateOrderMissingCount}</span>
                      <span className="text">Late Orders Missing Root Cause</span>
                    </p>
                  </div>
                )}
                {isGate3Checked && (
                  <div className="gate3Section">
                    <p className="gateSectionText">GATE3 - ORDER CLOSURE</p>

                    <p
                      onClick={handleWipClick}
                      style={{ backgroundColor: isWipFilterApplied ? '#d9e2ff' : 'transparent', height: isWipFilterApplied ? '32px' : 'auto', borderRadius: isWipFilterApplied ? '4px' : '0' }}
                    >
                      <span className="gateCount">{wipUnqueuedCount}</span>
                      <span className="text">WIP Unqueued</span>
                    </p>

                    <p
                      onClick={handleTecoSnoClick}
                      style={{
                        backgroundColor: isTecoSnoFilterApplied ? '#d9e2ff' : 'transparent',
                        height: isTecoSnoFilterApplied ? '32px' : 'auto',
                        borderRadius: isTecoSnoFilterApplied ? '4px' : '0',
                      }}
                    >
                      <span className="gateCount">{snoOpenCount}</span>
                      <span className="text">TECO'd SNO Open</span>
                    </p>
                  </div>
                )}
                {isSummaryChecked && (
                  <div>
                    <OrderExchangeAvailable agGridApis={agGridApis} isSummaryChecked={isSummaryChecked} />
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ borderBottom: '1px solid lightgray', marginTop: '10px' }}></div>
          )}
        </div>
      </div>

      <div className={asset-mgmt-right-container ${isCollapsed ? 'expanded' : 'contracted'}}>
        {showSaveCustomViewModal && (
          <SaveCustomViewModal
            currentViewName={currentAssetMgmtView ? currentAssetMgmtView.name : ''}
            onConfirm={viewName => {
              if (!confirmOverwriteSaveCustomView && assetMgmtCustomViews.some(view => view.name.toLocaleUpperCase() === viewName.toLocaleUpperCase() && view.appUserId !== null)) {
                setConfirmOverwriteSaveCustomView(true);
              } else {
                let newViewState = createViewStateObject();
                if (confirmOverwriteSaveCustomView) {
                  const existingView = assetMgmtCustomViews.find(view => view.name.toLocaleUpperCase() === viewName.toLocaleUpperCase() && view.appUserId !== null);
                  updateGridView(newViewState, existingView).then(() => {
                    if (viewSaveError) {
                      createToastInCollection('Error', View "${existingView.name}" could not be updated, false);
                    } else {
                      createToastInCollection('View Created', View "${existingView.name}" was updated successfully);
                    }
                  });
                  setViewStateDirty(false);
                } else {
                  saveGridView(viewName, newViewState, userData.plant.sapPlant).then(request => {
                    if (viewSaveError) {
                      createToastInCollection('Error', View ${viewName} could not be saved, false);
                    } else {
                      createToastInCollection('View Created', View "${viewName}" was created successfully);
                      addCustomViewInState(request.response[0]);
                      history.push(${location.pathname}?viewId=${request.response[0].id});
                    }
                  });
                }
                setShowSaveCustomViewModal(false);
                setConfirmOverwriteSaveCustomView(false);
                setShowSaveViewInProgress(true);
                setViewStateDirty(false);
              }
              AppInsights.trackEvent('Asset Save View');
            }}
            onClose={() => {
              console.log(JSON.stringify(createViewStateObject()));
              setShowSaveCustomViewModal(false);
              setConfirmOverwriteSaveCustomView(false);
            }}
            showConfirmOverwrite={confirmOverwriteSaveCustomView}
          />
        )}
        {showSaveViewInProgress && isPerformingViewOperation && (
          <SaveInProgressModal
            title={'Save Custom View'}
            onClose={() => {
              setShowSaveViewInProgress(false);
            }}
          />
        )}
        <div className="top-panel">
          <div className="topRightPanel">
            <div className="rightData">
              <div>
                <ActionsButton selectedRows={selectedRows} gridApi={agGridApis.gridApi} userData={props.userData} data={assetMgmtGridData} setSelectedRows={setSelectedRows} agedWipCategoryList={agedWipCategoryList} />
              </div>
              <QuickFilters
                gridApi={agGridApis.gridApi}
                // sapPlant={getPlant()}
                items={topFilters.tiers}
                isFetchingAssetMgmt={props.isFetchingAssetMgmt}
                selectionUpdated={items => {
                  onTopLevelFiltersChanged('tiers', items);
                }}
                assetMgmtGridData={assetMgmtGridData}
                doTopLevelFiltersPass={doTopLevelFiltersPass}
                onTopLevelFiltersChanged={onTopLevelFiltersChanged}
              />
            </div>
          </div>

          <div>{showFullScreen ? <AssetMaximizeView assetMgmtGridData={assetMgmtGridData} fullScreen={showFullScreen} /> : null}</div>

          <div className="topLeftPanel">
            {/* Refresh page */}
            <LastUpdatedIndicator lastUpdated={assetData.lastUpdated} />
            <div className="refresh" onClick={isFetchingAssetMgmt ? undefined : refreshData}>
              <span>
                {' '}
                <Icon className="mro-life-icons-download" fileName="Sync" />
              </span>
              Refresh
            </div>

            {/* Clear All filters */}
            <div className="clearFilters" onClick={clearAllFilters}>
              <span>Clear All Filters</span>
            </div>
            {/* <div>
              <ActionsButton selectedRows={selectedRows} userData={props.userData} data={assetMgmtGridData}/>
            </div> */}

            {/* Export to Excel */}
            <div className="export" onClick={isFetchingAssetMgmt ? undefined : exportData}>
              {' '}
              <span>
                <Icon className="mro-life-icons-download" fileName="UTCRotorDesignSystems_v0.3.0/Download" />
              </span>
              Export{' '}
            </div>

            {/* Maximize View */}
            {currentAssetMgmtView !== undefined ? (
              <div className="maximize" onClick={isFetchingAssetMgmt ? undefined : goFullScreen}>
                {' '}
                <span>
                  <Icon className="mro-life-icons-download" fileName="UTCRotorDesignSystems_v0.3.0/FullScreen" />
                </span>
                Maximize{' '}
              </div>
            ) : null}
          </div>
        </div>
        <div className="grid-section">
          <div
            className="ag-theme-balham"
            style={{
              width: '100%',
              height: 'calc(100vh - 30px)',
              padding: '8px 16px 16px 16px',
            }}
          >
            <AgGridWrapper
              // ref={assetMgmtGridRef}
              columnDefs={AssetMgmtTableColumnDefinitionsInstance.columnDefinitions(props, { editAgedWipCategory, editComments, editTags, saveDataforWip2Navigation }, assetData, agGridApis)}
              floatingFilter="true"
              rowData={rowData}
              rowSelection="multiple"
              // suppressContextMenu={true}
              suppressRowClickSelection="true"
              isExternalFilterPresent={areTopLevelFiltersActive}
              doesExternalFilterPass={doTopLevelFiltersPass}
              onGridReady={onGridReady}
              doesDataFlower={() => {
                return true;
              }}
              getRowStyle={getRowStyle}
              getRowHeight={getRowHeight}
              sideBar={{
                toolPanels: [
                  {
                    id: 'columns',
                    labelDefault: 'Columns',
                    labelKey: 'columns',
                    iconKey: 'columns',
                    toolPanel: agGridToolPanelTypes.ColumnsToolPanel,
                  },
                ],
              }}
              currentScreen={'assetMgmt'}
              excelStyles={excelStyles}
              overlayLoadingTemplate="Please wait while your data is loading."
              overlayNoRowsTemplate="No data found. Please adjust your selections."
              groupDisplayType={'custom'}
              groupUseEntireRow={true}
              frameworkComponents={assetMgmtComponents}
              groupRowRendererFramework={CustomRenderer}
              groupDefaultExpanded={0}
              suppressAggFuncInHeader={true}
              onFilterChanged={dirtyViewState}
              onColumnMoved={dirtyViewState}
              onSortChanged={dirtyViewState}
              setShowSaveCustomViewModal={setShowSaveCustomViewModal}
              setOverrideMaximizeCustomWidth={setOverrideMaximizeCustomWidth}
              setChartSelectedData={chartSelectedData}
              fullWidthCellRendererFramework={createSubTables}
              onCellMouseOver={onCellMouseOver}
              onCellMouseOut={onCellMouseOut}
              rowClass="hover-order-details-row"
              isFullWidthCell={isFullWidthCell}
              processCellFromClipboard={processCellFromClipboard}
              onCellClicked={params => {
                const target = params.colDef ? params.colDef.field : params.field;
                const targetchildGrid = params.colDef ? params.colDef.childGridType : params.childGridType; // this attribute is available only for expansion column and is defined in WorkInProgressColumnDefinition
                const current = params.node ? params.node : params;
                if (!current.expanded && params.data.mroPlant && (target === '' || target === 'mmlOpenTasks')) {
                  if (doesNeedExpansion(targetchildGrid, params.data)) {
                    rowChildgridMapping(params.data.mroCounter, targetchildGrid, true, params.data);
                    expandRow(current, targetchildGrid);

                    applyChildGridViewModel(targetchildGrid);
                  }
                } else if (current.expanded && (target === '' || target === 'mmlOpenTasks')) {
                  collapseRow(current, targetchildGrid, params.data.counter, params.data);
                }
              }}
              onToolPanelVisibleChanged={params => {
                if (params.api.isToolPanelShowing()) {
                  AppInsights.trackEvent('Asset Column Slide Out');
                  window.resetQualtricsVars();
                  window.isOpenColumnFlyOut = true;
                } else {
                  window.qualtricsInit();
                }
              }}
              onCellValueChanged={onCellValueChanged}
              onPasteEnd={onPasteEnd}
              onSelectionChanged={onSelectionChanged}
            />
          </div>
        </div>
        <ToastLayout />
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    assetData: state.AssetMgmtReducer,
    assetMgmtGridData: state.AssetMgmtReducer.data,
    isFetchingAssetMgmt: state.AssetMgmtReducer.isFetchingAssetMgmt,
    vendorSelected: state.AssetMgmtReducer.vendorSelected,
    customerNameSelected: state.AssetMgmtReducer.customerNameSelected,
    shipToSelected: state.AssetMgmtReducer.shipToSelected,
    noneSelected: state.AssetMgmtReducer.noneSelected,
    assetMgmtGroupBy: state.AssetMgmtReducer.assetMgmtGroupBy,
    currentAssetMgmtView: state.AssetMgmtCustomViewsReducer.currentAssetMgmtView,
    assetMgmtCustomViews: state.AssetMgmtCustomViewsReducer.assetMgmtCustomViews,
    isPerformingViewOperation: state.AssetMgmtCustomViewsReducer.isPerformingViewOperation,
    viewSaveError: state.AssetMgmtCustomViewsReducer.viewSaveError,
    userData: state.auth.userData,
    isSavingFavView: state.AssetMgmtCustomViewsReducer.isSavingFavView,
    enable: state.assetMgmtMaximizeView,
    viewRetrievalError: state.AssetMgmtCustomViewsReducer.viewRetrievalError,
    mroCompleteData: state.AssetMgmtChildReducer.data,
    assetChildGridModel: state.AssetMgmtChildReducer,
    users: state.users.allUsers,
    sendViewFetching: state.AssetMgmtReducer.sendViewFetching,
    sendViewError: state.AssetMgmtReducer.sendViewError,
    agedWipCategoryList: state.AssetMgmtReducer.agedWipCategoryList,
    currentGroupByOption: state.AssetMgmtReducer.currentGroupByOption,
    tags: state.AssetMgmtReducer.tags,
    // setTagsForAsset: state.AssetMgmtReducer.
  };
};

const mapDispatchToProps = dispatch => ({
  fetchAssetMgmtGridData: () => dispatch(fetchAssetMgmtGridData()),
  fetchData: userPlants => dispatch(fetchData(userPlants)),
  fetchChildData: (mroPlant, mroCounter, mroNotifNo, mroSoNo, mroWoNo) => dispatch(fetchChildData(mroPlant, mroCounter, mroNotifNo, mroSoNo, mroWoNo)),
  assetMgmtGroupBy: flag => dispatch(assetMgmtGroupBy(flag)),
  getCustomViews: () => dispatch(getCustomViews()),
  saveGridView: (viewName, newView, plant) => dispatch(saveGridView(viewName, newView, plant)),
  getGridViewWithId: (viewId, gridApi) => dispatch(getGridViewWithId(viewId, gridApi)),
  updateGridView: (view, viewId) => dispatch(updateGridView(view, viewId)),
  setGridView: view => dispatch(setGridView(view)),
  shareGridView: (name, recipients, gridView) => dispatch(shareGridView(name, recipients, gridView)),
  createToastInCollection: (title, message, success, duration) => dispatch(createToastInCollection(title, message, success, duration)),
  addAssetMgmtViewToFavourite: (viewId, view, getFavOrder) => {
    // Track the event
    AppInsights.trackEvent('Asset Add View To Favourite');

    // Dispatch the action
    dispatch(addAssetMgmtViewToFavourite(viewId, view, getFavOrder));
  },
  deleteAssetMgmtView: viewId => dispatch(deleteAssetMgmtView(viewId)),
  addCustomViewInState: view => dispatch(addCustomViewInState(view)),
  updateChildgridModel: (gridType, updateType, sortModel, ColumnModel, isNotDefaultState) => dispatch(updateChildgridModel(gridType, updateType, sortModel, ColumnModel, isNotDefaultState)),
  getAWCategoryList: () => dispatch(getAWCategoryList()),
  updateAWCategory: (formData, refreshRequest, fromScreen) => dispatch(updateAWCategory(formData, refreshRequest, fromScreen)),
  getAssetTags: () => dispatch(getAssetTags()),
  setTagsForAsset: (notifNo, soNo, woNo, plant, tags) => dispatch(setTagsForAsset(notifNo, soNo, woNo, plant, tags)),
  saveWip2RowIndex: (rowIndex) => dispatch(saveWip2SelectedRowIndex(rowIndex)),
  saveFromTab: (fromTab) => dispatch(saveFromTab(fromTab)),
  getPlantConfig: (userPlants) => dispatch(getPlantConfig(userPlants)),
  ...bindActionCreators(Object.assign(AssetMaximizeViewAction, UsersActions), dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(AssetManagementView);