import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';

test('should renders all element correctly', () => {
  render(
    <Router>
      <App />
    </Router>,
  );

  const titleElement = screen.getByText('Example With Search and Filter');
  const breadcrumbElement = screen.getByTestId('breadcrumb');
  const searchElement = screen.getByTestId('filter-keyword');
  const dropdownElement = screen.getByTestId('filter-gender');
  const buttonResetElement = screen.getByTestId('button-reset-filter');
  const tableDataElement = screen.getByTestId('table-data')
  const tablePaginationElement = screen.getByTestId('table-pagination')


  expect(titleElement).toBeInTheDocument();
  expect(breadcrumbElement).toBeInTheDocument();
  expect(searchElement).toBeInTheDocument();
  expect(dropdownElement).toBeInTheDocument();
  expect(buttonResetElement).toBeInTheDocument();
  expect(tableDataElement).toBeInTheDocument();
  expect(tablePaginationElement).toBeInTheDocument();
});

test('should table receive the right data', () => {

})

test('should pagination work properly', () => {

})

test('should sort table work properly', () => {

})

test('should action search filter able to change', () => {
  render(
    <Router>
      <App />
    </Router>,
  );
  type TestElement = Document | Element | Window | Node

  function hasInputValue(e: TestElement, inputValue: string) {
    return screen.getByDisplayValue(inputValue) === e
  }

  const input = screen.getByTestId("filter-keyword")

  fireEvent.change(input, { target: { value: 'susan' } })
  expect(hasInputValue(input, "susan")).toBe(true)
})

test('should action gender filter able to change', () => {
  render(
    <Router>
      <App />
    </Router>,
  );

  function hasInputValue(e: TestElement, inputValue: string) {
    return screen.getByDisplayValue(inputValue) === e
  }

  const input = screen.getByTestId("select-gender-option")

  fireEvent.change(input, { target: { value: 'male' } })
  expect(hasInputValue(input, "male")).toBe(true)

  let options = screen.getAllByTestId('select-gender-option')
  expect(options[0].selected).toBeFalsy();
  expect(options[1].selected).toBeTruthy();
  expect(options[2].selected).toBeFalsy();
})