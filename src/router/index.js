import Vue from 'vue'
import Router from 'vue-router'
import welcome from '@/view/admin/admin/welcome'

Vue.use(Router)

export default new Router({
  routes: [{
      meta: {
        title: '隐私协议',
      },
      path: '/privacy',
      component: () => import('@/view/admin/ohter/private.vue')
    },
    {
      path: '/',
      meta: {
        title: '首页',
      },
      component: () => import('@/view/admin/admin/index.vue'),
      redirect: 'welcome',
      children: [{
          meta: {
            title: '合同管理',
          },
          path: '/admin/task/contract',
          component: () => import('@/view/admin/task/contract.vue')
        },
        {
          meta: {
            title: '添加合同',
          },
          path: '/admin/task/add_contract',
          component: () => import('@/view/admin/task/add_contract.vue')
        },
        //广告位
        {
          meta: {
            title: '广告位管理',
          },
          path: '/admin/banner/list',
          component: () => import('@/view/admin/banner/list.vue')
        },
        {
          meta: {
            title: '编辑广告位',
          },
          path: '/admin/banner/add',
          component: () => import('@/view/admin/banner/add.vue')
        },
        //行为
        {
          meta: {
            title: '行为管理',
          },
          path: '/admin/behavior/list',
          component: () => import('@/view/admin/behavior/list.vue')
        },
        {
          meta: {
            title: '添加行为',
          },
          path: '/admin/behavior/add',
          component: () => import('@/view/admin/behavior/add.vue')
        },
        //任务分类
        {
          meta: {
            title: '分类管理',
          },
          path: '/admin/task_sort/list',
          component: () => import('@/view/admin/task_sort/list.vue')
        },
        {
          meta: {
            title: '添加分类',
          },
          path: '/admin/task_sort/add',
          component: () => import('@/view/admin/task_sort/add.vue')
        },
        //角色
        {
          meta: {
            title: '角色管理',
          },
          path: '/admin/role/list',
          component: () => import('@/view/admin/role/list.vue')
        },
        {
          meta: {
            title: '角色编辑',
          },
          path: '/admin/role/add',
          component: () => import('@/view/admin/role/add.vue')
        },
        //资讯
        {
          meta: {
            title: '资讯管理',
          },
          path: '/admin/new/list',
          component: () => import('@/view/admin/news/list.vue')
        },
        {
          meta: {
            title: '资讯添加',
          },
          path: '/admin/new/add',
          component: () => import('@/view/admin/news/add.vue')
        },
        //企业
        {
          meta: {
            title: '企业管理',
          },
          path: '/admin/enterprise/list',
          component: () => import('@/view/admin/enterprise/list.vue')
        },
        
        {
          meta: {
            title: '企业合同',
          },
          path: '/admin/enterprise/contract',
          component: () => import('@/view/admin/enterprise/contract.vue')
        },
        {
          meta: {
            title: '发票管理',
          },
          path: '/admin/enterprise/invoice',
          component: () => import('@/view/admin/enterprise/invoice.vue')
        },
        {
          meta: {
            title: '企业添加',
          },
          path: '/admin/enterprise/add',
          component: () => import('@/view/admin/enterprise/add.vue')
        },
        //角色
        {
          meta: {
            title: '管理员列表',
          },
          path: '/admin/adm/list',
          component: () => import('@/view/admin/adm/list.vue')
        },
        {
          meta: {
            title: '管理员日志',
          },
          path: '/admin/adm/log',
          component: () => import('@/view/admin/adm/log.vue')
        },
        {
          meta: {
            title: '管理员添加',
          },
          path: '/admin/adm/add',
          component: () => import('@/view/admin/adm/add.vue')
        },
        //订单
        {
          meta: {
            title: '订单管理',
          },
          path: '/admin/order/list',
          component: () => import('@/view/admin/order/list.vue')
        },
        {
          meta: {
            title: '人才管理',
          },
          path: '/admin/user/list',
          component: () => import('@/view/admin/user/list.vue')
        },
        //提现
        {
          meta: {
            title: '提现处理',
          },
          path: '/admin/financial/list',
          component: () => import('@/view/admin/financial/user_extract.vue')
        },
        {
          meta: {
            title: '交易明细',
          },
          path: '/admin/trading/history',
          component: () => import('@/view/admin/trading/history.vue')
        },
        {
          meta: {
            title: '人才搜索',
          },
          path: '/enterprise/user_search',
          component: () => import('@/view/admin/user/user_search.vue')
        },
        {
          meta: {
            title: '任务管理',
          },
          path: '/admin/task/list',
          component: () => import('@/view/admin/task/list.vue')
        },
        {

          path: '/welcome',
          component: () => import('@/view/admin/admin/welcome.vue'),
          meta: {
            title: '千马平台企业管理平台',
          },
        },
        { 

          path: '/admin/task/add',
          component: () => import('@/view/admin/task/add.vue'),
          meta: {
            title: '添加任务-千马平台企业管理平台',
          },
        }, {

          path: '/admin/up/list',
          component: () => import('@/view/admin/financial/up_list.vue'),
          meta: {
            title: '充值记录-千马平台企业管理平台',
          },
        },
        //统计中心
        {
          meta: {
            title: '会员统计',
          },
          path: '/admin/user/statistical',
          component: () => import('@/view/admin/statistical/user.vue')
        },
        //系统设置
        {
          meta: {
            title: '系统设置',
          },
          path: '/admin/config',
          component: () => import('@/view/admin/config/index.vue')
        },
        //提现设置
        {
          meta: {
            title: '提现设置',
          },
          path: '/admin/withdrawal',
          component: () => import('@/view/admin/config/withdrawal.vue')
        },
        //用户反馈
        {
          meta: {
            title: '用户反馈',
          },
          path: '/admin/feedback',
          component: () => import('@/view/admin/feedback/list.vue')
        },
      ]
    },

    {
      path: '/admin/login',
      component: () => import('@/view/admin/login/index.vue'),
      meta: {
        title: '登陆-千马平台企业管理平台',
      },
    }
  ],
  mode : "history"
})
