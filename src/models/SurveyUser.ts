import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { v4 as uuid } from 'uuid'
import { User } from "./User";
import { Survey } from "./Survey";

/**
 * Survey User Model for the database table
 */
@Entity("surveys_users")
class SurveyUser {
    @PrimaryColumn()
    readonly id: string;

    @Column()
    user_id: string;

    // Used to display the relation between this table
    // and the users table.
    @ManyToOne(() => User)
    @JoinColumn({ name: "user_id" })
    user: User;

    @Column()
    survey_id: string;

    // Used to display the relation between this table
    // and the surveys table.
    @ManyToOne(() => Survey)
    @JoinColumn({ name: "survey_id" })
    survey: Survey;

    @Column()
    value: number;

    @CreateDateColumn()
    created_at: Date;

    constructor() {
        if (!this.id) {
            this.id = uuid();
        }
    }
}

export { SurveyUser }