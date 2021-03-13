import React, {
  lazy,
  Suspense,
  Fragment,
} from 'react';

import {
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import AuthGuard from 'src/components/AuthGuard';
import GuestGuard from 'src/components/GuestGuard';
import RestricGuard from 'src/components/RestricGuard';
import LoadingScreen from 'src/components/LoadingScreen';
import DashboardLayout from 'src/layouts/DashboardLayout';

/* connectIntl */
import { formatMessage } from 'src/contexts/Intl';

export const renderRoutes = (routes = [], intl) => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Switch>
        {routes.map((route, i) => {
          const propsRoute = route.props || {};
          const Guard = route.guard || Fragment;
          const Layout = route.layout || Fragment;
          const Component = route.component;

          function renderComponent(props) {
            return (route.roles)
              ? (
                <RestricGuard roles={route.roles} >
                  <Component {...props} />
                </RestricGuard>
              )
              : <Component intl={intl} {...props} />
          }

          let path = route.path;
          if (route.multilanguage) {
            if (typeof path === 'object') {
              path = formatMessage(intl[path.value], path.params);
            } else {
              path = formatMessage(intl[path]);
            }
          }

          return (
            <Route
              key={i}
              path={path}
              exact={route.exact}
              render={(props) => (
                <Guard>
                  <Layout>
                    {
                      route.routes
                        ? renderRoutes(route.routes, intl)
                        : renderComponent({ ...props, ...propsRoute })
                    }
                  </Layout>
                </Guard>
              )}
            />
          );
        })}
      </Switch>
    </Suspense>
  );
};

const routes = [
  {
    exact: true,
    path: '/testing',
    component: lazy(() => import('src/views/errors/NotFoundView'))
  },
  {
    exact: true,
    path: '/404',
    component: lazy(() => import('src/views/errors/NotFoundView'))
  },
  {
    exact: true,
    guard: GuestGuard,
    path: 'urlLogin',
    multilanguage: true,
    component: lazy(() => import('src/views/auth/LoginView'))
  },
  {
    exact: true,
    guard: GuestGuard,
    path: 'urlAdminLogin',
    multilanguage: true,
    component: lazy(() => import('src/views/auth/LoginView'))
  },
  {
    exact: true,
    path: '/login-unprotected',
    component: lazy(() => import('src/views/auth/LoginView'))
  },
  {
    exact: true,
    guard: GuestGuard,
    path: '/verification',
    component: lazy(() => import('src/views/auth/VerificationView/JWTVerification'))
  },
  {
    exact: true,
    path: '/verification-unprotected',
    component: lazy(() => import('src/views/auth/VerificationView/JWTVerification'))
  },
  {
    exact: true,
    guard: GuestGuard,
    path: 'urlRegister',
    multilanguage: true,
    component: lazy(() => import('src/views/auth/RegisterView'))
  },
  {
    exact: true,
    guard: GuestGuard,
    path: '/forgotpassword',
    component: lazy(() => import('src/views/auth/ForgotpasswordView'))
  },
  {
    exact: true,
    path: '/resetpass',
    component: lazy(() => import('src/views/auth/ResetPasswordView'))
  },
  {
    exact: true,
    guard: GuestGuard,
    path: 'url2FA',
    multilanguage: true,
    component: lazy(() => import('src/views/2falogin'))
  },
  {
    exact: true,
    path: '/register-unprotected',
    component: lazy(() => import('src/views/auth/RegisterView'))
  },
  {
    path: '*',
    guard: AuthGuard,
    layout: DashboardLayout,
    routes: [
      // NEW ROUTER START
      // student start
      {
        exact: true,
        multilanguage: true,
        path: 'urlStudents',
        component: lazy(() => import('src/views/students/ListView'))
      },
      {
        exact: true,
        multilanguage: true,
        path: {
          value: 'urlStudentDetail',
          params: {
            studentId: ':studentId'
          }
        },
        component: lazy(() => import('src/views/students/DetailsView'))
      },
      {
        exact: true,
        multilanguage: true,
        path: {
          value: 'urlStudentEdit',
          params: {
            studentId: ':studentId'
          }
        },
        component: lazy(() => import('src/views/students/EditView'))
      },
      {
        exact: true,
        multilanguage: true,
        path: 'urlStudentAdd',
        component: lazy(() => import('src/views/students/AddView'))
      },
      // student end
      // lesson start
      {
        exact: true,
        multilanguage: true,
        path: 'urlLesson',
        component: lazy(() => import('src/views/lessons/ListView'))
      },
      {
        exact: true,
        multilanguage: true,
        path: {
          value: 'urlLessonEdit',
          params: {
            lessonId: ':lessonId'
          }
        },
        component: lazy(() => import('src/views/lessons/EditView'))
      },
      {
        exact: true,
        multilanguage: true,
        path: {
          value: 'urlLessonDetail',
          params: {
            lessonId: ':lessonId'
          }
        },
        component: lazy(() => import('src/views/lessons/DetailsView'))
      },
      {
        exact: true,
        multilanguage: true,
        path: 'urlLessonAdd',
        component: lazy(() => import('src/views/lessons/AddView'))
      },
      // lesson end
      // bill start
      {
        exact: true,
        multilanguage: true,
        path: 'urlBill',
        component: lazy(() => import('src/views/bills/ListView'))
      },
      {
        exact: true,
        multilanguage: true,
        path: {
          value: 'urlBillDetail',
          params: {
            billId: ':billId'
          }
        },
        component: lazy(() => import('src/views/bills/DetailsView'))
      },
      // bill end
      // groups start
      {
        exact: true,
        multilanguage: true,
        path: 'urlGroup',
        component: lazy(() => import('src/views/groups/ListView'))
      },
      {
        exact: true,
        multilanguage: true,
        path: 'urlGroupAdd',
        component: lazy(() => import('src/views/groups/AddView'))
      },
      {
        exact: true,
        multilanguage: true,
        path: {
          value: 'urlGroupDetail',
          params: {
            groupId: ':groupId'
          }
        },
        component: lazy(() => import('src/views/groups/DetailsView'))
      },
      {
        exact: true,
        multilanguage: true,
        path: {
          value: 'urlGroupEdit',
          params: {
            groupId: ':groupId'
          }
        },
        component: lazy(() => import('src/views/groups/EditView'))
      },
      // groups end
      // {
      // 	exact: true,
      // 	multilanguage: true,
      // 	path: 'urlProfile',
      // 	component: lazy(() => import('src/views/profile'))
      // },
      // {
      // 	exact: true,
      // 	multilanguage: true,
      // 	path: 'urlProduct',
      // 	component: lazy(() => import('src/views/product'))
      // },
      // {
      // 	exact: true,
      // 	multilanguage: true,
      // 	path: 'urlLicense',
      // 	component: lazy(() => import('src/views/licenses/LicensesListView'))
      // },
      // {
      // 	exact: true,
      // 	multilanguage: true,
      // 	path: 'urlAppbalance',
      // 	component: lazy(() => import('src/views/balance/balanceListView'))
      // },
      // {
      // 	exact: true,
      // 	multilanguage: true,
      // 	path: 'urlAppwithdrawal',
      // 	component: lazy(() => import('src/views/withdrawl/withdrawalListView'))
      // },
      // {
      // 	exact: true,
      // 	multilanguage: true,
      // 	path: 'urlAppaffiliate',
      // 	component: lazy(() => import('src/views/affiliates/affiliateListView'))
      // },
      // {
      // 	exact: true,
      // 	multilanguage: true,
      // 	path: 'urlAppmarketing',
      // 	component: lazy(() => import('src/views/marketing/marketingListView'))
      // },
      // {
      // 	exact: true,
      // 	multilanguage: true,
      // 	path: 'urlAppoperation',
      // 	component: lazy(() => import('src/views/operations/operationListView'))
      // },
      // {
      // 	exact: true,
      // 	multilanguage: true,
      // 	path: 'urlAppsupport',
      // 	component: lazy(() => import('src/views/support/supportListView'))
      // },
      // {
      // 	exact: true,
      // 	multilanguage: true,
      // 	path: 'urlApplegal',
      // 	component: lazy(() => import('src/views/legal/legalListView'))
      // },
      // {
      // 	exact: true,
      // 	multilanguage: true,
      // 	path: 'urlBotcontrol',
      // 	component: lazy(() => import('src/views/bot/control/Control'))
      // },
      // {
      // 	exact: true,
      // 	multilanguage: true,
      // 	path: 'urlBottickers',
      // 	component: lazy(() => import('src/views/bot/tickers/Tickers'))
      // },
      // {
      // 	exact: true,
      // 	multilanguage: true,
      // 	path: 'urlBotopportunity',
      // 	component: lazy(() => import('src/views/bot/opportunity/Opportunity'))
      // },
      // {
      // 	exact: true,
      // 	multilanguage: true,
      // 	path: 'urlBotoppcertification',
      // 	component: lazy(() => import('src/views/bot/oppCertification/OppCertification'))
      // },
      // {
      // 	exact: true,
      // 	multilanguage: true,
      // 	path: 'urlBotresults',
      // 	component: lazy(() => import('src/views/bot/results/Results'))
      // },
      // {
      // 	exact: true,
      // 	multilanguage: true,
      // 	path: 'urlBotresultscertification',
      // 	component: lazy(() => import('src/views/bot/resultCertification/ResultCertification'))
      // },
      // {
      // 	exact: true,
      // 	multilanguage: true,
      // 	path: 'urlBotmlresult',
      // 	component: lazy(() => import('src/views/bot/ml_result/ML_result'))
      // },
      // {
      // 	exact: true,
      // 	multilanguage: true,
      // 	path: 'urlBotmainnetresults',
      // 	component: lazy(() => import('src/views/bot/mainnetResultsCertification/MainnetResultsCertification'))
      // },
      // {
      // 	exact: true,
      // 	multilanguage: true,
      // 	path: 'urlBotmannetopportunities',
      // 	component: lazy(() => import('src/views/bot/mainnetOpportunitiesCertification/MainnetOpportunitiesCertification'))
      // },
      // NEW ROUTER END
      {
        component: () => <Redirect to="/" />
      }
    ]
  },
];

export default routes;
