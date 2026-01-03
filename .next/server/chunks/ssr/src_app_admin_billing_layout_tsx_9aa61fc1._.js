;!function(){try { var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof global?global:"undefined"!=typeof window?window:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&((e._debugIds|| (e._debugIds={}))[n]="cac0361e-c93c-2834-7eca-97d640855c3b")}catch(e){}}();
module.exports=[736900,a=>{"use strict";var b=a.i(907997),c=a.i(71895),d=a.i(968021),e=a.i(890365),f=a.i(544813);async function g({children:a}){let g=await (0,c.getServerSession)(d.authOptions).catch(()=>null);try{(0,f.requireAdminPermission)(g?.user||null,"VIEW_BILLING")}catch{return(0,b.jsx)(e.default,{})}return(0,b.jsx)(b.Fragment,{children:a})}a.s(["default",()=>g])}];

//# debugId=cac0361e-c93c-2834-7eca-97d640855c3b
//# sourceMappingURL=src_app_admin_billing_layout_tsx_9aa61fc1._.js.map