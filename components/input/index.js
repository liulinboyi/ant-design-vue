import { createApp } from 'vue';
import Input from './Input';
import Group from './Group';
import Search from './Search';
import TextArea from './TextArea';
import Password from './Password';
import antInputDirective from '../_util/antInputDirective';

createApp().use(antInputDirective);

Input.Group = Group;
Input.Search = Search;
Input.TextArea = TextArea;
Input.Password = Password;

/* istanbul ignore next */
Input.install = function(app) {
  app.component(Input.name, Input);
  app.component(Input.Group.name, Input.Group);
  app.component(Input.Search.name, Input.Search);
  app.component(Input.TextArea.name, Input.TextArea);
  app.component(Input.Password.name, Input.Password);
};

export default Input;
