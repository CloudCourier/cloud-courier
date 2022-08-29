import { useMemo } from 'react';
import { LocaleProvider } from '@douyinfe/semi-ui';
import { IntlProvider } from 'react-intl';
import { HashRouter } from 'react-router-dom';
import zh_CN from '@douyinfe/semi-ui/lib/es/locale/source/zh_CN';
import en_GB from '@douyinfe/semi-ui/lib/es/locale/source/en_GB';
import { localeConfig } from './locales';
import RenderRouter from './routers';
import './reset.scss';
import { useAppSelector } from './hooks/store';

function App() {
  const locale = useAppSelector(state => state.global.locale);

  const getLocale = useMemo(() => {
    if (locale === 'en_GB') {
      return en_GB;
    } else if (locale === 'zh_CN') {
      return zh_CN;
    }
  }, [locale]);

  return (
    <LocaleProvider locale={getLocale}>
      <IntlProvider locale={locale.split('_')[0]} messages={localeConfig[locale]}>
        <HashRouter>
          <RenderRouter />
        </HashRouter>
      </IntlProvider>
    </LocaleProvider>
  );
}

export default App;
