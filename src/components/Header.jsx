import { AppBar, Title, Toolbar } from './styled/AppBar';
import { Select, Label } from './styled/Select';

export default function Header({ contexts, selectedContext, onContextChange }) {
  return (
    <AppBar>
      <Title>🚢 Kubis</Title>
      <Toolbar>
        <Label>Contexto:</Label>
        <Select 
          value={selectedContext} 
          onChange={(e) => onContextChange(e.target.value)}
        >
          <option value="">Selecione um contexto</option>
          {contexts.map(ctx => (
            <option key={ctx} value={ctx}>{ctx}</option>
          ))}
        </Select>
      </Toolbar>
    </AppBar>
  );
}