import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

interface ResponseAttributes {
    response_id: number;
    question_id: number;
    survey_id: number; //ask if this is ok // this is the survey id that the question belongs to
    user_id: number;
    response_data: string;
    created_at: Date;
}

interface ResponseCreationAttributes extends Optional<ResponseAttributes, 'response_id' | 'created_at'> {}

export class ResponseModel extends Model<ResponseAttributes, ResponseCreationAttributes> implements ResponseAttributes {
    public response_id!: number;
    public question_id!: number;
    public survey_id!: number; //ask if this is ok // this is the survey id that the question belongs to
    public user_id!: number;
    public response_data!: string;
    public created_at!: Date;
}

export const initResponseModel = (sequelize: Sequelize) => {
    ResponseModel.init({
        response_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        question_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        survey_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        response_data: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
    }, {
        sequelize,
        tableName: 'Responses',
        timestamps: false,
    });
};
