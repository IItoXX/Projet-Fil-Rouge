import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Utilisateur } from './utilisateur.entity';
import { RoleUtilisateur } from './role.enum';

@Injectable()
export class UtilisateursService implements OnModuleInit
{
    constructor(
        @InjectRepository(Utilisateur)
        private readonly depot: Repository<Utilisateur>,
    )
    {
    }

    async onModuleInit()
    {
        await this.creerAdminParDefaut();
    }

    async creer(email: string, motDePasseClair: string, nom: string, role: RoleUtilisateur): Promise<Utilisateur>
    {
        const empreinte = await bcrypt.hash(motDePasseClair, 10);
        const utilisateur = this.depot.create({ email, motDePasse: empreinte, nom, role });
        return this.depot.save(utilisateur);
    }

    async trouverParEmail(email: string): Promise<Utilisateur | null>
    {
        return this.depot.findOne({ where: { email } });
    }

    async trouverParId(id: string): Promise<Utilisateur | null>
    {
        return this.depot.findOne({ where: { id } });
    }

    async listerTous(): Promise<Utilisateur[]>
    {
        return this.depot.find();
    }

    private async creerAdminParDefaut()
    {
        const existant = await this.trouverParEmail('admin@flapazon.fr');
        if (existant)
        {
            return;
        }
        await this.creer('admin@flapazon.fr', 'testtest', 'Administrateur', RoleUtilisateur.ADMIN);
    }
}