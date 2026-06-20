import { RequestStatus } from 'features/constants';
import {
  reducer,
  fetchClassAnalyticsWidgetsRequest,
  fetchClassAnalyticsWidgetsSuccess,
  fetchClassAnalyticsWidgetsFailed,
  resetClassAnalyticsWidgets,
} from 'features/Classes/data/slice';

describe('Classes analytics widgets reducer', () => {
  test('Should set loading state when analytics widgets request starts', () => {
    const state = reducer(undefined, fetchClassAnalyticsWidgetsRequest());

    expect(state.classAnalyticsWidgets.status).toEqual(RequestStatus.LOADING);
    expect(state.classAnalyticsWidgets.error).toEqual(null);
  });

  test('Should store widgets when analytics widgets request succeeds', () => {
    const widgets = [
      {
        key: 'class_average_score',
        title: 'Class Average Score',
        formatted_value: '100.0%',
      },
    ];

    const state = reducer(undefined, fetchClassAnalyticsWidgetsSuccess(widgets));

    expect(state.classAnalyticsWidgets.data).toEqual(widgets);
    expect(state.classAnalyticsWidgets.status).toEqual(RequestStatus.SUCCESS);
    expect(state.classAnalyticsWidgets.error).toEqual(null);
  });

  test('Should clear widgets and set error state when analytics widgets request fails', () => {
    const initialState = reducer(
      undefined,
      fetchClassAnalyticsWidgetsSuccess([
        {
          key: 'class_average_score',
          title: 'Class Average Score',
          formatted_value: '100.0%',
        },
      ]),
    );

    const state = reducer(initialState, fetchClassAnalyticsWidgetsFailed());

    expect(state.classAnalyticsWidgets.data).toEqual([]);
    expect(state.classAnalyticsWidgets.status).toEqual(RequestStatus.ERROR);
    expect(state.classAnalyticsWidgets.error).toEqual(true);
  });

  test('Should reset analytics widgets state', () => {
    const initialState = reducer(
      undefined,
      fetchClassAnalyticsWidgetsSuccess([
        {
          key: 'class_average_score',
          title: 'Class Average Score',
          formatted_value: '100.0%',
        },
      ]),
    );

    const state = reducer(initialState, resetClassAnalyticsWidgets());

    expect(state.classAnalyticsWidgets.data).toEqual([]);
    expect(state.classAnalyticsWidgets.status).toEqual(RequestStatus.INITIAL);
    expect(state.classAnalyticsWidgets.error).toEqual(null);
  });
});
