using Microsoft.AspNetCore.SignalR;

namespace Chatterbox.Hub
{
    public class Chathub : Hub<IChatHub>
    {
        public override async Task OnConnectedAsync()
        {
            await Clients.Others.JoinParty(Context.ConnectionId, $"joined the party!");

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            await Clients.Others.LeftParty(Context.ConnectionId, $"left the party!");

            await base.OnDisconnectedAsync(exception);
        }


        public async Task Send(string user, string message)
        {
            await Clients.Caller.SuccessSendMessage(Context.ConnectionId, message, true);

            await Clients.Client(user).SuccessSendMessage(user, message);

        }

    }


    public interface IChatHub
    {
        Task SuccessSendMessage(string user, string message, bool isMine = false);

        Task JoinParty(string user, string message);

        Task LeftParty(string user, string message);
    }


}
