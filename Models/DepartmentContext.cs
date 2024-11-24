using Microsoft.EntityFrameworkCore;

namespace department.Models
{
    public class DepartmentContext : DbContext
    {
        public DepartmentContext(DbContextOptions<DepartmentContext>options) : base(options)
        {
            
        }
        public DbSet<Department> Department { get; set; } 
    }
}
