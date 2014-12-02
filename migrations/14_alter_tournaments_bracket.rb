Sequel.migration do
  up do
    alter_table(:tournaments) do
       drop_column :data
       add_column :data_teams, String, :text=>true
       add_column :data_results, String, :text=>true
    end
  end

  down do
    alter_table(:tournaments) do
       add_column :data, Strign, :text=>true
       drop_column :data_teams
       drop_column :data_results
    end
  end
end
