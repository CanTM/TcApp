import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from "app/home/home.component";
import { LoginComponent } from "app/login/login.component";
import { CursosComponent } from "app/cursos/cursos.component";
import { ModuleWithProviders } from '@angular/core';
import { CursoDetalheComponent } from "app/curso-detalhe/curso-detalhe.component";
import { CursoNaoEncontradoComponent } from "app/curso-nao-encontrado/curso-nao-encontrado.component";
import { CadastroComponent} from "app/cadastro/cadastro.component";
import { BuscaComponent } from "app/busca/busca.component";

const APP_ROUTES: Routes = [
    {path: 'cursos', component: CursosComponent},
    {path: 'curso/:id', component: CursoDetalheComponent},
    {path: 'login', component: LoginComponent},
    {path: 'naoEncontrado', component: CursoNaoEncontradoComponent},
    {path: 'cadastro', component: CadastroComponent},
    {path: 'busca', component: BuscaComponent},
    {path: '', component: BuscaComponent}
];

export const routing: ModuleWithProviders = RouterModule.forRoot(APP_ROUTES);