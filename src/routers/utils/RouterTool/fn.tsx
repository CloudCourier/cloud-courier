import React from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import Guard from './guard';
import { RouterWaiterPropsType, MetaType, FunctionalImportType } from '../types';

export default class Fn {
  routes;

  onRouteBefore;

  loading;

  constructor(option: RouterWaiterPropsType) {
    this.routes = option.routes || [];
    this.onRouteBefore = option.onRouteBefore;
    this.loading = option.loading || <div />;
  }

  /**
   * @description: 路由配置列表数据转换
   * @param {string} redirect 要重定向的路由路径
   * @param {function} component 函数形式import懒加载组件
   * @param {object} meta 自定义字段
   */
  transformRoutes(routeList = this.routes) {
    const list: RouteObject[] = [];
    routeList.forEach(route => {
      const obj = { ...route };
      if (obj.path === undefined) {
        return;
      }
      if (obj.redirect) {
        obj.element = <Navigate to={obj.redirect} replace />;
      }
      if (obj.component) {
        obj.element = this.lazyLoad(obj.component, obj.meta || {});
      }
      delete obj.redirect;
      delete obj.component;
      delete obj.meta;
      if (obj.children) {
        obj.children = this.transformRoutes(obj.children);
      }
      list.push(obj);
    });
    return list;
  }

  /**
   * @description: 路由懒加载
   */
  lazyLoad(importFn: FunctionalImportType, meta: MetaType) {
    const Element = React.lazy(importFn);
    const lazyElement = (
      <React.Suspense fallback={this.loading}>
        <Element _meta={meta} />
      </React.Suspense>
    );
    return <Guard element={lazyElement} meta={meta} onRouteBefore={this.onRouteBefore} />;
  }
}
