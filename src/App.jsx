import {
  Activity, Bell, Boxes, ChevronDown, CircleDollarSign, Clock3,
  FolderKanban, LayoutDashboard, Menu, PackageCheck, Search,
  Settings, TrendingUp, Users, Zap,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/theme-toggle';
import { cn } from '@/lib/utils';

const navigation = [
  { label: 'Visão geral', icon: LayoutDashboard, active: true },
  { label: 'Projetos', icon: FolderKanban },
  { label: 'Equipe', icon: Users },
  { label: 'Automações', icon: Zap },
  { label: 'Configurações', icon: Settings },
];

const metrics = [
  { title: 'Projetos ativos', value: '12', change: '+2 este mês', icon: FolderKanban },
  { title: 'Tarefas concluídas', value: '248', change: '+18% na semana', icon: PackageCheck },
  { title: 'Horas economizadas', value: '36h', change: '+8h na semana', icon: Clock3 },
  { title: 'Receita acompanhada', value: 'R$ 84 mil', change: '+12,5% no mês', icon: CircleDollarSign },
];

const activities = [
  { initials: 'MC', name: 'Marina Costa', action: 'concluiu a revisão do projeto Atlas', time: 'Há 8 min', color: 'bg-blue-500' },
  { initials: 'RL', name: 'Rafael Lima', action: 'criou uma nova automação', time: 'Há 32 min', color: 'bg-violet-500' },
  { initials: 'AS', name: 'Ana Souza', action: 'adicionou 4 tarefas ao sprint', time: 'Há 1 h', color: 'bg-emerald-500' },
  { initials: 'JP', name: 'João Prado', action: 'atualizou o cronograma do projeto', time: 'Há 3 h', color: 'bg-amber-500' },
];

function Brand() {
  return (
    <div className="flex h-16 items-center gap-3 px-5">
      <div className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
        <Boxes className="size-5" />
      </div>
      <div>
        <p className="text-sm font-semibold tracking-tight">Kubis</p>
        <p className="text-xs text-muted-foreground">Workspace</p>
      </div>
    </div>
  );
}

function Navigation({ onNavigate }) {
  return (
    <nav aria-label="Navegação principal" className="flex-1 space-y-1 px-3 py-4">
      <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Principal</p>
      {navigation.map(({ label, icon: Icon, active }) => (
        <button
          type="button"
          key={label}
          onClick={onNavigate}
          aria-current={active ? 'page' : undefined}
          className={cn(
            'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring',
            active ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground',
          )}
        >
          <Icon className="size-4" />{label}
        </button>
      ))}
    </nav>
  );
}

function SidebarContent({ onNavigate }) {
  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <Brand />
      <Separator />
      <Navigation onNavigate={onNavigate} />
      <div className="p-3">
        <div className="rounded-xl border bg-background/70 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium"><TrendingUp className="size-4 text-primary" />Plano Pro</div>
          <p className="mb-3 text-xs leading-relaxed text-muted-foreground">Acompanhe todos os seus projetos em um só lugar.</p>
          <Button size="sm" className="w-full">Ver detalhes</Button>
        </div>
      </div>
    </div>
  );
}

function ProfileMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-10 gap-2 px-2" aria-label="Abrir menu do perfil">
          <Avatar><AvatarFallback>RJ</AvatarFallback></Avatar>
          <span className="hidden text-left md:block"><span className="block text-sm leading-none">Romualdo</span><span className="mt-1 block text-xs font-normal text-muted-foreground">Administrador</span></span>
          <ChevronDown className="hidden size-3.5 md:block" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Perfil</DropdownMenuItem>
        <DropdownMenuItem>Preferências</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Sair</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Header() {
  return (
    <header className="app-drag sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/90 px-4 backdrop-blur md:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button className="app-no-drag lg:hidden" variant="ghost" size="icon" aria-label="Abrir menu"><Menu /></Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="sr-only"><SheetTitle>Menu principal</SheetTitle><SheetDescription>Navegação do Kubis</SheetDescription></SheetHeader>
          <SidebarContent />
        </SheetContent>
      </Sheet>
      <div className="app-no-drag relative hidden w-full max-w-md sm:block">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input aria-label="Buscar" placeholder="Buscar projetos, tarefas ou pessoas..." className="bg-muted/50 pl-9" />
      </div>
      <div className="ml-auto flex items-center gap-1 app-no-drag">
        <Button variant="ghost" size="icon" aria-label="Notificações" className="relative"><Bell /><span className="absolute right-2 top-2 size-1.5 rounded-full bg-primary" /></Button>
        <ThemeToggle />
        <Separator orientation="vertical" className="mx-2 h-7" />
        <ProfileMenu />
      </div>
    </header>
  );
}

function MetricCard({ metric }) {
  const Icon = metric.icon;
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{metric.title}</CardTitle>
        <div className="rounded-lg bg-primary/10 p-2 text-primary"><Icon className="size-4" /></div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight">{metric.value}</div>
        <p className="mt-1 flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400"><TrendingUp className="size-3" />{metric.change}</p>
      </CardContent>
    </Card>
  );
}

function Dashboard() {
  return (
    <main className="min-w-0 flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div><Badge variant="secondary" className="mb-2">Quinta-feira, 6 de agosto</Badge><h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Bom dia, Romualdo</h1><p className="mt-1 text-sm text-muted-foreground">Aqui está um resumo do seu workspace hoje.</p></div>
          <Button><Zap />Nova automação</Button>
        </div>

        <section aria-labelledby="resumo-heading">
          <h2 id="resumo-heading" className="sr-only">Resumo</h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{metrics.map((metric) => <MetricCard key={metric.title} metric={metric} />)}</div>
        </section>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
          <Card>
            <CardHeader className="flex-row items-start justify-between space-y-0">
              <div><CardTitle>Progresso semanal</CardTitle><CardDescription>Entregas concluídas nos últimos sete dias</CardDescription></div>
              <Badge variant="outline">Esta semana</Badge>
            </CardHeader>
            <CardContent>
              <div className="flex h-56 items-end justify-between gap-2 pt-4" role="img" aria-label="Gráfico de progresso semanal">
                {[42, 68, 54, 82, 65, 92, 74].map((height, index) => (
                  <div key={['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'][index]} className="flex h-full flex-1 flex-col justify-end gap-2">
                    <div className="group relative flex-1 rounded-md bg-muted"><div className="absolute inset-x-0 bottom-0 rounded-md bg-primary/80 transition-colors group-hover:bg-primary" style={{ height: `${height}%` }} /></div>
                    <span className="text-center text-[11px] text-muted-foreground">{['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'][index]}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><div className="flex items-center justify-between"><div><CardTitle>Atividade recente</CardTitle><CardDescription>Atualizações da sua equipe</CardDescription></div><Activity className="size-5 text-muted-foreground" /></div></CardHeader>
            <CardContent className="space-y-5">
              {activities.map((item) => (
                <div key={item.name} className="flex min-w-0 items-start gap-3">
                  <Avatar className="size-8"><AvatarFallback className={cn(item.color, 'text-white')}>{item.initials}</AvatarFallback></Avatar>
                  <div className="min-w-0 flex-1"><p className="text-sm leading-snug"><span className="font-medium">{item.name}</span> <span className="text-muted-foreground">{item.action}</span></p><p className="mt-1 text-xs text-muted-foreground">{item.time}</p></div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}

function App() {
  return (
    <div className="flex h-screen min-w-0 overflow-hidden bg-background">
      <aside className="hidden w-64 shrink-0 border-r lg:block"><SidebarContent /></aside>
      <div className="flex min-w-0 flex-1 flex-col"><Header /><Dashboard /></div>
    </div>
  );
}

export { App };
