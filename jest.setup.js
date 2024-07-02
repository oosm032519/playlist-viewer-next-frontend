import '@testing-library/jest-dom'
import {toHaveNoViolations} from 'jest-axe';
import 'jest-fetch-mock';

expect.extend(toHaveNoViolations);
