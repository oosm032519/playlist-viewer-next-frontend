import '@testing-library/jest-dom'
import {toHaveNoViolations} from 'jest-axe';
import 'jest-fetch-mock';
import '@jest/globals';

expect.extend(toHaveNoViolations);
