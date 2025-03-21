export interface DataFieldProperties {
  fieldName: string;
  data: string;
}

const DataField: React.FC<DataFieldProperties> = ({ fieldName, data }) => {
  return (
    <div className="flex flex-row gap-2.5 self-start">
      <span className="text-xl font-bold">{fieldName + ":"}</span>
      <span className="text-xl">{data}</span>
    </div>
  );
};

export default DataField;
