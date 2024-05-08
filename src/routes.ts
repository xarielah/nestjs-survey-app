import { Routes } from '@nestjs/core';
import { SurveyModule } from './survey/survey.module';

/**
 * I'm using this external routes definition to avoid defining
 * further on a repetitive prefix for different controllers.
 */
export const routes: Routes = [
  {
    path: '/api',
    module: SurveyModule,
  },
];
