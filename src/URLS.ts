import { model, Schema, Document } from 'mongoose'

interface IURLDocument extends Document {
	url: string,
	shortened: string,
}

const urlSchema = new Schema<IURLDocument>({
	url: String,
	shortened: String,
})

urlSchema.methods.toJSON = function () {
	const obj: IURLDocument = this.toObject();
	obj.id = obj._id.toJSON();
	delete obj._id;
	delete obj.__v;
	return obj;
};

export default model<IURLDocument>('URL', urlSchema)

export type {
	IURLDocument
}