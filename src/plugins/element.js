import Vue from "vue"
import { Input, Button, Form, FormItem,Message,Container,Header, Aside,Main, Menu,MenuItem,Submenu,Breadcrumb,BreadcrumbItem
,Card,Row,Col,Table, TableColumn, Pagination, Dialog, Select,Option,MessageBox, Transfer, Switch} from 'element-ui';

Vue.use(Input);
Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Menu);
Vue.use(MenuItem);
Vue.use(Submenu);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Card);
Vue.use(Row);
Vue.use(Col);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Pagination);
Vue.use(Dialog);
Vue.use(Select);
Vue.use(Option);
Vue.use(Transfer);
Vue.use(Switch);
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
